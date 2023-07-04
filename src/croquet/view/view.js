import {eventEmitter} from "../../event/event_emitter.js";
import {Triple} from "../../utility/triple.js";
import {ManipulatorView} from "./manipulator_view.js";
import {SceneManager} from "../../babylon/scene_manager.js";
class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param {any} model the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;
        this.sceneManager = new SceneManager();
        this.hologramsManipulatorMenu = new Map();
        this.hologramManipulatorView = new Map();


        this.#log("subscribed");

        this.#setupBackEndEventHandlers();
        this.#setupModelEventHandlers();
    }

    freezeControlButton(data){
        this.#log("received freezeControlButton hologram " + data.hologramName);

        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.#setOtherUserInControlBehaviorControlButton(hologramControls.y);
    }

    restoreControlButton(data){
        this.#log("received restore ControlButton hologram " + data.hologramName);

        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.hologramManipulatorView.get(hologramName).removeElementHologramManipulator();
        this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
    }

    showHologramUpdates(data){
        this.hologramManipulatorView.get(data.hologramName).updateHologram(data);
    }

    showUserManipulation(data){
        this.#log("received show userManipulation")

        const hologramName = data.hologramName;
        if(!this.hologramManipulatorView.has(hologramName)){
            const hologramModel = this.model.children.get(hologramName);
            const hologramView = new ManipulatorView(hologramModel, hologramName, this.viewId);
            this.hologramManipulatorView.set(hologramName, hologramView);
            hologramView.showOtherUserManipulation();
        }else{
            this.hologramManipulatorView.get(hologramName).showOtherUserManipulation();
        }
    }


    #setOtherUserInControlBehaviorControlButton(controlButton){
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Red();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.67, 0.29, 0.29);

        controlButton.imageUrl = "../../img/IconClose.png";
        controlButton.onPointerDownObservable.clear();
    }

    updateHologramColor(hologramName){
        this.#log("received updateHologramColor");
        this.sceneManager.hologramRenders.get(hologramName).updateColor(this.model.hologramModel.holograms.get(hologramName).color);
    }

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
        this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
        this.subscribe(this.viewId, "showUserManipulation", this.showUserManipulation);
        this.subscribe(this.viewId, "showHologramUpdates", this.showHologramUpdates);

        this.subscribe("view", "updateHologramColor", this.updateHologramColor);
    }

    #notifyUserStartManipulating(hologramName){
        this.#log("user start manipulating hologram " + hologramName);
        this.publish("controlButton", "clicked", {view: this.viewId, hologramName: hologramName});
    }

    #notifyCurrentUserReleaseControl(hologramName){
        this.#log("user stop manipulating");

        this.hologramManipulatorView.get(hologramName).removeElementHologramManipulator();
        this.#setDefaultControlButtonBehavior(hologramName, this.hologramsManipulatorMenu.get(hologramName).y);
        this.publish("controlButton", "released", {view: this.viewId, hologramName: hologramName});
    }

    #addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.children.get(hologramName).hologram;
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
            if(!this.hologramManipulatorView.has(hologramName)) {
                const hologramModel = this.model.children.get(hologramName);
                const hologramView = new ManipulatorView(hologramModel, hologramName, this.viewId);
                this.hologramManipulatorView.set(hologramName, hologramView);
            }

            this.#notifyUserStartManipulating(hologramName);
            this.hologramManipulatorView.get(hologramName).addHologramManipulator();
            this.#setManipulatingBehaviourControlButton(hologramName, controlButton);
        });
    }

    #setManipulatingBehaviourControlButton(hologramName, controlButton){
        controlButton.text = "Stop manipulating";
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Green();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.67, 0.45);

        controlButton.onPointerDownObservable.clear();
        controlButton.onPointerDownObservable.add(() => {
            this.#notifyCurrentUserReleaseControl(hologramName);
        });
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("addManipulatorMenu", (data) => {
            this.#log("received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;
            let boundingBoxHigh = null;

            if(typeof object.boundingBoxHigh !== undefined){
                boundingBoxHigh = object.boundingBoxHigh;
            }

            this.#addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh);
        });

        eventEmitter.on("initialize", (data) => {
            this.sceneManager.initializeScene();
        });

        eventEmitter.on("render", (data) => {
            this.sceneManager.activateRenderLoop();
        });

        eventEmitter.on("standardHologramShow", (data) => {
            this.sceneManager.addStandardHologram(this.model.hologramModel.holograms.get(data));
        })

        eventEmitter.on("colorChange", (data) => {
            this.publish("updateHologram", "changeColor", data);
        })

        //TODO
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("VIEW: " + message);
        }
    }
}



export { RootView };