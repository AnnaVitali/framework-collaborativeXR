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
        this.holograms = new Map();
        this.synchronizedVariables = new Map();
    }

    /**
     * Add a hologram to the synchronized element.
     * @param hologram {Hologram} the hologram to add.
     */
    addHologram(hologram){
        this.holograms.set(hologram.name, hologram);
    }

    /**
     * Add a synchronized variable to the synchronized element.
     * @param variable {SynchronizedVariable} the variable to add
     */
    addSynchronizedVariable(variable){
        this.synchronizedVariables.set(variable.name, variable);
    }

    sendEvent(event, data){
        eventBus.emit(event, data);
    }

    listenForInfrastructureEvent(event, callback){
        eventBus.on(event, callback)
    }

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