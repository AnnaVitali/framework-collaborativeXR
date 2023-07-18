import {eventBus} from "../../eventBus/event_bus.js";

/**
 * Class responsible to manage the event related to the infrastructure part.
 */
class InfrastructureEventManager{
    /**
     * Empty constructor of the class.
     */
    constructor(){
        this.view = null;
    }

    /**
     * Send a new event to the core part.
     * @param event {String} the name of the event.
     * @param data {String} the data to send.
     */
    sendEvent(event, data){
        eventBus.emit(event, data);
    }

    /**
     * Set the root view of reference.
     * @param rootView {Croquet.View} the root view of the application.
     */
    setRootView(rootView){
        this.view = rootView;
    }

    /**
     * Listen for specific event from the core part.
     */
    listenForCoreEvents(){
        eventBus.on("initialize", () => {
            this.#log("initialize scene");
            this.view.initializeScene();
        });

        eventBus.on("render", () => {
            this.#log("run render loop");
            this.view.runRenderLoop();
        });

        eventBus.on("createImportedHologram", (data)=>{
            this.#log("create imported hologram")
           this.view.notifyEventToModel("create", "importedHologram", {view: this.view.viewId, hologram: JSON.parse(data)});
        });

        eventBus.on("createStandardHologram", (data) => {
            this.#log("create standard hologram")
            this.view.notifyEventToModel("create", "standardHologram", {view: this.view.viewId, hologram: JSON.parse(data)});
        } );

        eventBus.on("createSynchronizedVariable", (data)=>{
            this.#log("create synchronized variable")
            console.log(data);
           this.view.notifyEventToModel("create", "synchronizedVariable", JSON.parse(data));
        });

        eventBus.on("addManipulatorMenu", (data) => {
            this.#log("add manipulator menu")
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;

            console.log(hologramName);

            this.view.addManipulatorMenu(hologramName, menuPosition);
        });

        eventBus.on("addNearMenu", (data) => {
            this.#log("add near menu")
            const object = JSON.parse(data);
            const menuRows = object._rows;
            const menuPosition = object._position;
            const buttonList = object.buttonList;

            this.view.addNearMenu(menuRows, menuPosition, buttonList);
        });

        eventBus.on("newAnimation", (data) =>{
            this.#log("add animation")
            this.view.notifyEventToModel("animation", "createAnimation", JSON.parse(data));
        });

        eventBus.on("stopAnimation", (data) => {
            this.#log("stop animation")
            this.view.notifyEventToModel("animation", "stopAnimation", JSON.parse(data));
        })

        eventBus.on("valueChange", (data) => {
            this.view.notifyEventToModel("synchronizedVariable", "valueChange",JSON.parse(data));
        });

        eventBus.on("colorChange", (data) => {
            this.view.notifyEventToModel( "updateHologram", "changeColor", JSON.parse(data));
        });

        eventBus.on("scalingChange", (data) => {
            this.view.notifyEventToModel( "updateHologram", "changeScaling", JSON.parse(data));
        });

        eventBus.on("positionChange", (data) => {
            this.view.notifyEventToModel( "updateHologram", "changePosition", JSON.parse(data));
        });

        eventBus.on("rotationChange", (data) => {
            this.view.notifyEventToModel( "updateHologram", "changeColor", JSON.parse(data));
        });
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("I-EVENT: " + message);
        }
    }

}

const infrastructureEventManager = new InfrastructureEventManager();
export {infrastructureEventManager}