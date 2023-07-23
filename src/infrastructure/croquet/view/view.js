import {eventBus} from "../../../eventBus/event_bus.js";
import {SceneManager} from "../../babylon/scene_manager.js"
import {infrastructureEventManager} from "../../utility/infrastructure_event_manager.js";
import {HologramView} from "./hologram_view.js";

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
        this.hologramView = new HologramView(this.model.hologramModel, this.sceneManager);

        infrastructureEventManager.setRootView(this);

        this.#checkFirstViewInCharge()
        this.#setupModelEventHandlers();

        infrastructureEventManager.listenForCoreEvents();
    }

    /**
     * Initialize the WebXR scene.
     */
    initializeScene(){
        const renderCanvas = document.createElement('canvas')
        renderCanvas.setAttribute("id", "renderCanvas");
        renderCanvas.setAttribute("style", "width: 100%; height: 100%");
        document.body.appendChild(renderCanvas);

        this.sceneManager.initializeScene();
    }

    /**
     * Run the render loop.
     */
    runRenderLoop(){
        this.hologramView.showCurrentManipulation();
        this.sceneManager.activateRenderLoop();
    }

    /**
     * Notify a specific event to the Model.
     * @param event {String} the name of the event.
     * @param message {String} the message to send.
     * @param data {Object} the data to send.
     */
    notifyEventToModel(event, message, data){
        this.publish(event, message, data);
    }

    /**
     * Add a near menu to the scene.
     * @param menuRows {Number} the number of rows in which the menu is organized.
     * @param menuPosition {Vector3} the positionSphere1 of the menu in space.
     * @param buttonList {[Button]} the list of button that compose the menu.
     */
    addNearMenu(menuRows, menuPosition, buttonList){
        const holographicButtonList = this.sceneManager.addNearMenu(menuPosition, menuRows, buttonList);
        holographicButtonList.forEach(button => {
            button.onPointerDownObservable.add(() => {
                eventBus.emit(button.name, "");
            });
        })
    }

    /**
     * Propagate the tick received form the model.
     * @param animationName {String} the name of the animation to be updated.
     */
    propagateTick(animationName){
        infrastructureEventManager.sendEvent(animationName, "");
    }

    /**
     * Require the backend to set the update for the element.
     */
    setElementUpdate(){
        this.#log("received setUpdate")
        infrastructureEventManager.sendEvent("setUpdate", "");
    }

    #checkFirstViewInCharge(){
        if(this.model.linkedViews.length === 1){
            this.#log("set view in charge");
            this.publish("view", "viewInCharge", this.viewId);
            this.setElementUpdate();
        }
    }

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "setUpdate", this.setElementUpdate);
        this.subscribe("view", "animationTick", this.propagateTick);
    }

    #log(message){
        const debug = false;
        if(debug){
            console.log("VIEW: " + message);
        }
    }
}

export { RootView }