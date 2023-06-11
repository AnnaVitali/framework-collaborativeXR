import {eventEmitter} from "../event/event_emitter.js";
import {Pair} from "../utility/pair.js";
class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param {any} model the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;
        this.hologramsManipulatorMenu = new Map();

        console.log("VIEW subscribed ");

        this.#setupBackEndEventHandlers();
    }

    #addManipulatorMenu(hologramName, menuPosition, buttonProperties) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.hologramModel.holograms.get(hologramName);
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.TouchHolographicButton();
        this.#setDefaultControlButtonBehavior(controlButton, buttonProperties)

        manipulatorNearMenu.addButton(controlButton);

        this.hologramsManipulatorMenu.set(hologramName, new Pair(manipulatorNearMenu, controlButton));
    }

    #setDefaultControlButtonBehavior(controlButton, buttonProperties) {
        controlButton.text = buttonProperties._text;
        controlButton.imageUrl = buttonProperties._imgFilePath;
        controlButton.onPointerDownObservable.clear();
        /*this.controlButton.onPointerDownObservable.add(() => {
            this.#addHologramManipulator();
            this.notifyUserStartManipulating();
        });*/
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("addManipulatorMenu", (data) => {
            console.log("VIEW: received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;
            const buttonProperties = object.buttonProperties;

            console.log("name " + hologramName);
            console.log("position " + menuPosition);
            console.log("button properties " + buttonProperties);

            this.#addManipulatorMenu(hologramName, menuPosition, buttonProperties);
        })
    }
}



export { RootView };