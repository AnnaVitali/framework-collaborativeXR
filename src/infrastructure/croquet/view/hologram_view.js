import {Triple} from "../../../utility/triple.js";

const MAX_EVENT_FOR_SECOND = 20;
const REFERENCE_TIME_EVENT = 1000;

/**
 * Class that represents a View in charge of handling the rendering aspects of the holograms.
 */
class HologramView extends Croquet.View{
    /**
     * Constructor of the class
     * @param model {Croquet.Model} the model of reference.
     * @param sceneManager {SceneManager} the scene manager of the application.
     */
    constructor(model, sceneManager){
        super(model);
        this.model = model;
        this.sceneManager = sceneManager;
        this.hologramsManipulatorMenu = new Map();

        this.#setupModelEventHandlers();
    }

    /**
     * Add a menu that allow the user to manipulate a hologram.
     * @param hologramName {String} the name of the hologram.
     * @param menuPosition {Vector3} the positionSphere1 of the menu in space.
     */
    addManipulatorMenu(hologramName, menuPosition) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.sceneManager.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        this.sceneManager.hologramRenders.get(hologramName).initializeElementManipulation();
        manipulatorNearMenu.parent = this.sceneManager.hologramRenders.get(hologramName).mesh;
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.HolographicButton("manipulate", false);
        manipulatorNearMenu.addButton(controlButton);

        this.#setDefaultControlButtonBehavior(hologramName, controlButton);
        this.hologramsManipulatorMenu.set(hologramName, new Triple(manipulatorNearMenu, controlButton));
    }

    /**
     * Require to show the imported hologram.
     * @param hologramName {String} object containing the data of the hologram.
     */
    showImportedHologram(hologramName){
        this.sceneManager.addImportedHologram(this.model.holograms.get(hologramName));
    }

    /**
     * Require to show the standard hologram.
     * @param hologramName {String} object containing the data of the hologram.
     */
    showStandardHologram(hologramName){
        this.sceneManager.addStandardHologram(this.model.holograms.get(hologramName));
    }

    /**
     * Require to show the manipulation of the hologram
     * @param data {Object} object containing the hologram data.
     */
    showUserManipulation(data){
        this.#log("received show userManipulation " + data.hologramName);
        const hologramName = data.hologramName;

        const hologramRender = this.sceneManager.hologramRenders.get(hologramName);
        hologramRender.showOtherUserManipulation();
    }

    /**
     * Require to show the updated positionSphere1 of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedPosition(hologramName){
        const newPosition = this.model.holograms.get(hologramName).position;
        this.sceneManager.hologramRenders.get(hologramName).updatePosition(newPosition);
    }

    /**
     * Require to show the updated rotationSphere1 of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedRotation(hologramName){
        const newRotation = this.model.holograms.get(hologramName).rotation;
        this.sceneManager.hologramRenders.get(hologramName).updateRotation(newRotation);
    }

    /**
     * Require to show the updated scale of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedScaling(hologramName){
        const newScaling = this.model.holograms.get(hologramName).scaling;
        this.sceneManager.hologramRenders.get(hologramName).updateScaling(newScaling);
    }

    /**
     * Require to show the updated colorSphere of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedColor(hologramName){
        this.#log("received updateHologramColor");
        this.sceneManager.hologramRenders.get(hologramName).updateColor(this.model.holograms.get(hologramName).color);
    }

    /**
     * Make the control button no more clickable.
     * @param data {Object} object containing the data related to the hologram of reference.
     */
    freezeControlButton(data){
        this.#log("received freezeControlButton hologram " + data.hologramName);

        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.#setOtherUserInControlBehaviorControlButton(hologramControls.y);
    }

    /**
     * Restore the normal behaviour of the control button.
     * @param data {Object} object containing the data related to the hologram of reference.
     */
    restoreControlButton(data){
        this.#log("received restore ControlButton hologram " + data.hologramName);

        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.sceneManager.hologramRenders.get(hologramName).removeHologramManipulator();
        this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
    }

    /**
     * Set a tick for sending event. Is better to send only 20 events for seconds.
     */
    clockEventTick(){
        this.timeElapsed = true;
    }

    #setOtherUserInControlBehaviorControlButton(controlButton){
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Red();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.67, 0.29, 0.29);

        controlButton.imageUrl = "https://github.com/AnnaVitali/framework-collaborativeXR/blob/master/img/IconClose.png";
        controlButton.onPointerDownObservable.clear();
    }

    #notifyUserStartManipulating(hologramName){
        this.#log("user start manipulating hologram " + hologramName);
        this.publish("controlButton", "clicked", {view: this.viewId, hologramName: hologramName});
    }

    #notifyCurrentUserReleaseControl(hologramName){
        this.#log("user stop manipulating");
        this.publish("controlButton", "released", {view: this.viewId, hologramName: hologramName});
    }

    #setDefaultControlButtonBehavior(hologramName, controlButton) {
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Blue();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.37, 0.67);
        controlButton.text = "Manipulate";
        controlButton.imageUrl = "https://github.com/AnnaVitali/framework-collaborativeXR/blob/master/img/IconAdjust.png";
        controlButton.onPointerDownObservable.clear();

        controlButton.onPointerDownObservable.add(() => {
            this.#log("clicked");
            this.#notifyUserStartManipulating(hologramName);
            const hologramRender = this.sceneManager.hologramRenders.get(hologramName);
            hologramRender.addHologramManipulator();
            let eventCount = 0;
            this.timeElapsed = false;
            let isClockSet = false;

            hologramRender.sixDofDragBehavior.onPositionChangedObservable.add(() => {
                eventCount += 1;
                if(!isClockSet){
                    this.future(REFERENCE_TIME_EVENT).clockEventTick();
                    isClockSet = true;
                }
                if(eventCount < MAX_EVENT_FOR_SECOND && !this.timeElapsed) {
                    this.publish("hologramManipulation", "positionChanged", this.#serializeDataPosition(hologramName, hologramRender));
                }else if(this.timeElapsed){
                    isClockSet = false;
                    this.timeElapsed = false;
                    eventCount = 0;
                }
            });

            hologramRender.gizmo.onScaleBoxDragObservable.add(() => {
                this.publish("hologramManipulation", "scaleChanged", this.#serializeDataScale(hologramName, hologramRender));
            });

            this.#setManipulatingBehaviourControlButton(hologramName, controlButton);
            this.publish("hologramManipulator", "showUserManipulation", {view: this.viewId, hologramName: hologramName})
        });
    }

    #serializeDataPosition(hologramName, hologramRender){
        const absolutePosition = hologramRender.boundingBox.absolutePosition;
        return {
            hologramName: hologramName,
            view: this.viewId,
            position_x: absolutePosition.x,
            position_y: absolutePosition.y,
            position_z: absolutePosition.z
        }
    }

    #serializeDataScale(hologramName, hologramRender){
        const absoluteScaling = hologramRender.boundingBox.absoluteScaling;
        return {
            hologramName: hologramName,
            view: this.viewId,
            scale_x: absoluteScaling.x,
            scale_y: absoluteScaling.y,
            scale_z: absoluteScaling.z
        }
    }

    #setManipulatingBehaviourControlButton(hologramName, controlButton){
        controlButton.text = "Stop manipulating";
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Green();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.67, 0.45);

        controlButton.onPointerDownObservable.clear();
        controlButton.onPointerDownObservable.add(() => {
            this.#notifyCurrentUserReleaseControl(hologramName);
            this.sceneManager.hologramRenders.get(hologramName).removeHologramManipulator();
            this.#setDefaultControlButtonBehavior(hologramName, controlButton);
        });
    }

    showCurrentManipulation(){
        this.model.hologramInUserControl.forEach((v, k)=>{
            this.sceneManager.hologramRenders.get(k).showOtherUserManipulation();
            this.freezeControlButton({hologramName: k});
        });
    }

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
        this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
        this.subscribe(this.viewId, "showUserManipulation", this.showUserManipulation);
        this.subscribe(this.viewId, "showHologramUpdatedPosition", this.showHologramUpdatedPosition);
        this.subscribe(this.viewId, "showHologramUpdatedScaling", this.showHologramUpdatedScaling);
        this.subscribe(this.viewId, "showImportedHologram", this.showImportedHologram);
        this.subscribe(this.viewId, "showStandardHologram", this.showStandardHologram);

        this.subscribe("view", "updateHologramColor", this.showHologramUpdatedColor);
        this.subscribe("view", "updateHologramScaling", this.showHologramUpdatedScaling);
        this.subscribe("view", "updateHologramPosition", this.showHologramUpdatedPosition);
        this.subscribe("view", "updateHologramRotation", this.showHologramUpdatedRotation);
    }

    #log(message){
        const debug = false;
        if(debug){
            console.log("H-VIEW: " + message);
        }
    }
}

export{HologramView}