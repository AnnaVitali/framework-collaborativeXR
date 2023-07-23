import {eventBus} from "../../eventBus/event_bus.js";
import {synchronizedElementUpdater} from "./synchronized_element_updater.js";
import {HologramProperty} from "../hologram/enum/hologram_property.js";

/**
 * Utility class, used to made element consistent.
 */
class CoreEventManager{

    /**
     * Empty constructor of the class.
     */
    constructor(){
    }

    /**
     * Send a new event to the infrastructure part.
     * @param event {String} the name of the event.
     * @param data {String} the data to send.
     */
    sendEvent(event, data){
        eventBus.emit(event, data);
    }

    /**
     * Listen for a specific infrastructure event.
     * @param event {String} the name of the event.
     * @param callback the callback to apply when the event is received.
     */
    listenForInfrastructureEvent(event, callback){
        eventBus.on(event, callback)
    }

    /**
     * Listen for the update event related to synchronized elements.
     */
    listenForSynchronizedElementUpdateEvents(){
        eventBus.on("updateValue", (data) =>{
            const object = JSON.parse(data);
            synchronizedElementUpdater.updateSynchronizedVariable(object.variableName, object.value);

        });

        eventBus.on("updatePosition", (data) =>{
            const object = JSON.parse(data);
            synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Position, object.position);
        });

        eventBus.on("updateRotation", (data) =>{
            const object = JSON.parse(data);
            synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Rotation, object.rotation);
        });

        eventBus.on("updateScaling", (data) =>{
            const object = JSON.parse(data);
            synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Scaling, object.scaling);
        });

        eventBus.on("updateColor", (data) =>{
            const object = JSON.parse(data);
            synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Color, object.color);
        });

    }
} 

const coreEventManager = new CoreEventManager();

export {coreEventManager}