import {eventEmitter} from "../event/event_emitter.js";
import {Triple} from "../utility/triple.js";
import {ManipulatorView} from "./manipulator_view.js";
class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param {any} model the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;
        this.hologramsManipulatorMenu = new Map();
        this.hologramManipulatorView = new Map();
        this.debug = true;

        this.#log("VIEW subscribed ");

        this.#setupBackEndEventHandlers();
        this.#setupModelEventHandlers();
    }

    freezeControlButton(data){
        this.#log("VIEW: received freezeControlButton hologram " + data.hologramName);
        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);

        this.#setOtherUserInControlBehaviorControlButton(hologramControls.y);
    }

    restoreControlButton(data){
        this.#log("VIEW: received restore ControlButton hologram " + data.hologramName);
        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.hologramManipulatorView.get(hologramName).removeElementHologramManipulator();
        this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
    }

    showHologramUpdates(data){
        this.hologramManipulatorView.get(data.hologramName).updateHologram(data);
    }

    showUserManipulation(data){
        this.#log("VIEW: received show userManipulation")
        const hologramName = data.hologramName;
        if(!this.hologramManipulatorView.has(hologramName)){
            const hologramView = new ManipulatorView(this.model.hologramModel, hologramName, this.viewId);
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

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
        this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
        this.subscribe(this.viewId, "showUserManipulation", this.showUserManipulation);
        this.subscribe(this.viewId, "showHologramUpdates", this.showHologramUpdates);
    }

    #notifyUserStartManipulating(hologramName){
        this.#log("VIEW: user start manipulating hologram " + hologramName);
        this.publish("controlButton", "clicked", {view: this.viewId, hologramName: hologramName});
    }

    #notifyCurrentUserReleaseControl(hologramName){
        this.#log("VIEW: user stop manipulating");
        this.hologramManipulatorView.get(hologramName).removeElementHologramManipulator();
        this.#setDefaultControlButtonBehavior(hologramName, this.hologramsManipulatorMenu.get(hologramName).y);
        this.publish("controlButton", "released", {view: this.viewId, hologramName: hologramName});
    }

    #addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.hologramModel.holograms.get(hologramName).parent;
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
                const hologramView = new ManipulatorView(this.model.hologramModel, hologramName, this.viewId);
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
            this.#log("VIEW: received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;
            let boundingBoxHigh = null;

            if(typeof object.boundingBoxHigh !== undefined){
                boundingBoxHigh = object.boundingBoxHigh;
            }

            this.#addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh);
        })
    }

    #log(message){
        if(this.debug){
            console.log(message);
        }
    }
}



export { RootView };