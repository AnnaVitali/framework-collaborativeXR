import {eventBus} from "../../../event/event_emitter.js";
import {Triple} from "../../../utility/triple.js";
import {SceneManager} from "../../babylon/scene_manager.js"

/**
 * Class that represents the root view of the application
 */
class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param model {Croquet.Model}  the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;
        this.sceneManager = new SceneManager();
        this.hologramsManipulatorMenu = new Map();

        this.#setupUpdate()
        this.#setupBackEndEventHandlers();
        this.#setupModelEventHandlers();
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
     * Require to show the updated position of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedPosition(hologramName){
        const newPosition = this.model.hologramModel.holograms.get(hologramName).position;
        this.sceneManager.hologramRenders.get(hologramName).updatePosition(newPosition);
    }

    /**
     * Require to show the updated rotation of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedRotation(hologramName){
        const newRotation = this.model.hologramModel.holograms.get(hologramName).rotation;
        this.sceneManager.hologramRenders.get(hologramName).updateRotation(newRotation);
    }

    /**
     * Require to show the updated scale of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedScale(hologramName){
        const newScale = this.model.hologramModel.holograms.get(hologramName).scale;
        this.sceneManager.hologramRenders.get(hologramName).updateScale(newScale);
    }

    /**
     * Require to show the updated color of the hologram.
     * @param hologramName {String} the hologram name.
     */
    showHologramUpdatedColor(hologramName){
        this.#log("received updateHologramColor");
        this.sceneManager.hologramRenders.get(hologramName).updateColor(this.model.hologramModel.holograms.get(hologramName).color);
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
        this.sceneManager.hologramRenders.get(hologramName).removeElementHologramManipulator();
        this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
    }

    /**
     * Require to show the imported hologram.
     * @param hologramName {String} object containing the data of the hologram.
     */
    showImportedHologram(hologramName){
        this.sceneManager.addImportedHologram(this.model.hologramModel.holograms.get(hologramName));
    }

    /**
     * Require to show the standard hologram.
     * @param hologramName {String} object containing the data of the hologram.
     */
    showStandardHologram(hologramName){
        this.sceneManager.addStandardHologram(this.model.hologramModel.holograms.get(hologramName));
    }

    /**
     * Propagate the tick received form the model.
     * @param animationName {String} the name of the animation to be updated.
     */
    propagateTick(animationName){
        eventBus.emit(animationName, "");
    }

    /**
     * Require the backend to set the update for the element.
     */
    setElementUpdate(){
        this.#log("received setUpdate")
        eventBus.emit("setUpdate", "");
    }

    #setupUpdate(){
        if(this.model.linkedViews.length === 1){
            this.#log("set view in charge");
            this.publish("view", "viewInCharge", this.viewId);
            this.setElementUpdate();
        }
    }

    #setOtherUserInControlBehaviorControlButton(controlButton){
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Red();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.67, 0.29, 0.29);

        controlButton.imageUrl = "../../img/IconClose.png";
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

    #addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.sceneManager.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.sceneManager.hologramRenders.get(hologramName).mesh;
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.HolographicButton("manipulate", false);
        manipulatorNearMenu.addButton(controlButton);

        this.#setDefaultControlButtonBehavior(hologramName, controlButton, boundingBoxHigh);
        this.hologramsManipulatorMenu.set(hologramName, new Triple(manipulatorNearMenu, controlButton));
    }

    #setDefaultControlButtonBehavior(hologramName, controlButton) {
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Blue();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.37, 0.67);
        controlButton.text = "Manipulate";
        controlButton.imageUrl = "../../img/IconAdjust.png";
        controlButton.onPointerDownObservable.clear();

        controlButton.onPointerDownObservable.add(() => {
            this.#log("clicked");
            this.#notifyUserStartManipulating(hologramName);
            this.publish("hologramManipulator", "showUserManipulation", {view: this.viewId, hologramName: hologramName});
            const hologramRender = this.sceneManager.hologramRenders.get(hologramName);
            hologramRender.addHologramManipulator();

            hologramRender.getSixDofDragBehaviour().onPositionChangedObservable.add(() => {
                this.publish("hologramManipulation", "positionChanged", this.#serializeDataPosition(hologramName, hologramRender));
            });

            hologramRender.getGizmo().onScaleBoxDragObservable.add(() => {
                this.publish("hologramManipulation", "scaleChanged", this.#serializeDataScale(hologramName, hologramRender));
            });

            this.#setManipulatingBehaviourControlButton(hologramName, controlButton);
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
            this.sceneManager.hologramRenders.get(hologramName).removeElementHologramManipulator();
            this.#setDefaultControlButtonBehavior(hologramName, controlButton);
        });
    }

    #requireToAddNearMenu(nearMenuData){
        const object = JSON.parse(nearMenuData);

        const menuRows = object._rows;
        const menuPosition = object._position;
        const buttonList = object.buttonList;

        const holographicButtonList = this.sceneManager.addNearMenu(menuPosition, menuRows, buttonList);
        console.log(holographicButtonList);
        holographicButtonList.forEach(button => {
            button.onPointerDownObservable.add(() => {
                eventBus.emit(button.name, "");
            });
        })
    }

    #showCurrentManipulation(){
        console.log(this.model.hologramInUserControl);
        this.model.hologramInUserControl.forEach((v, k)=>{
            this.sceneManager.hologramRenders.get(k).showOtherUserManipulation();
            this.freezeControlButton({hologramName: k});
        });
    }

    #setupBackEndEventHandlers(){
        eventBus.on("initialize", (data) => {
            this.sceneManager.initializeScene();
        });

        eventBus.on("render", (data) => {
            this.#showCurrentManipulation();
            this.sceneManager.activateRenderLoop();
        });

        eventBus.on("createImportedHologram", (data)=>{
            this.#log("createImportedHologram model");
            this.publish("create", "importedHologram", {view: this.viewId, hologram: JSON.parse(data)});
        });

        eventBus.on("createStandardHologram", (data) => {
            this.#log("createStandardHologramModel");
            this.publish("create", "standardHologram", {view: this.viewId, hologram: JSON.parse(data)});
        } );

        eventBus.on("createSynchronizedVariable", (data)=>{
            this.#log("create synchronized variable");
            this.publish("create", "synchronizedVariable", JSON.parse(data));
        });

        eventBus.on("addManipulatorMenu", (data) => {
            this.#log("received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;

            this.#addManipulatorMenu(hologramName, menuPosition);
        });

        eventBus.on("addNearMenu", (data) => {
            this.#log("received add near menu");
            this.#requireToAddNearMenu(data);
        });

        eventBus.on("newAnimation", (data) =>{
            this.publish("animation", "createAnimation", JSON.parse(data));
        });

        eventBus.on("stopAnimation", (data) => {
            this.publish("animation", "stopAnimation", JSON.parse(data));
        })

        eventBus.on("valueChange", (data) => {
            this.#log("received value change");
            this.publish("synchronizedVariable", "valueChange",JSON.parse(data));
        });

        eventBus.on("colorChange", (data) => {
            this.#log("received color change");
            this.publish( "updateHologram", "changeColor", JSON.parse(data));
        });

        eventBus.on("scalingChange", (data) => {
            this.#log("received scaling change");
            this.publish( "updateHologram", "changeScaling", JSON.parse(data));
        });

        eventBus.on("positionChange", (data) => {
            this.#log("received position change");
            this.publish( "updateHologram", "changePosition", JSON.parse(data));
        });

        eventBus.on("rotationChange", (data) => {
            this.#log("received rotation change");
            this.publish( "updateHologram", "changeColor", JSON.parse(data));
        });
    }

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
        this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
        this.subscribe(this.viewId, "showUserManipulation", this.showUserManipulation);
        this.subscribe(this.viewId, "showHologramUpdatedPosition", this.showHologramUpdatedPosition);
        this.subscribe(this.viewId, "showHologramUpdatedScale", this.showHologramUpdatedScale);
        this.subscribe(this.viewId, "setUpdate", this.setElementUpdate);
        this.subscribe(this.viewId, "showImportedHologram", this.showImportedHologram);
        this.subscribe(this.viewId, "showStandardHologram", this.showStandardHologram);

        this.subscribe("view", "animationTick", this.propagateTick);
        this.subscribe("view", "updateHologramColor", this.showHologramUpdatedColor);
        this.subscribe("view", "updateHologramScaling", this.showHologramUpdatedScale);
        this.subscribe("view", "updateHologramPosition", this.showHologramUpdatedPosition);
        this.subscribe("view", "updateHologramRotation", this.showHologramUpdatedRotation);
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("VIEW: " + message);
        }
    }
}



export { RootView };