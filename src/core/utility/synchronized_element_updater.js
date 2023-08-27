import {HologramProperty} from "../hologram/enum/hologram_property.js";
import {coreEventManager} from "./core_event_manager.js";

class SynchronizedElementUpdater{
    /**
     * Empty constructor of the class.
     */
    constructor(){
        this.holograms = new Map();
        this.standardObjects = new Map();

        coreEventManager.listenForInfrastructureEvent("setUpdate", ()=> this.update = true);
    }

    /**
     * Get value of the variable update.
     * @returns {boolean}
     */
    get update() {
        return this._update;
    }

    /**
     * Set if this user has to manage the update or not.
     * @param value
     */
    set update(value) {
        this._update = value;
    }

    /**
     * Add a hologram to the synchronized element.
     * @param hologram {Hologram} the hologram to add.
     */
    addHologram(hologram){
        this.holograms.set(hologram.name, hologram);
    }

    /**
     * Add a standard object to the synchronized element.
     * @param object {StandardObject} the object to add.
     */
    addStandardObject(object){
        this.standardObjects.set(object.name, object);
    }

    /**
     * Update the hologram.
     * @param hologramName {String} the name of the hologram.
     * @param property {HologramProperty} the property to update.
     * @param value the new value to assign.
     */
    updateHologram(hologramName, property, value){
        switch (property){
            case HologramProperty.Position:
                this.#updatePosition(hologramName, value);
                break;
            case HologramProperty.Rotation:
                this.#updateRotation(hologramName, value);
                break;
            case HologramProperty.Scaling:
                this.#updateScaling(hologramName, value);
                break;
            case HologramProperty.Color:
                this.#updateColor(hologramName, value);
                break;
        }
    }

    /**
     * Update the value of a standard object.
     * @param variableName {String} the name of the variable.
     * @param value the value of the variable.
     */
    updateStandardObject(variableName, value){
        this.standardObjects.get(variableName).changeValueWithoutSync(value);
    }
 
    #updateColor(hologramName, value) {
        this.holograms.get(hologramName).changeColorWithoutSync(value);
    }

    #updateScaling(hologramName, value) {
        this.holograms.get(hologramName).changeScalingWithoutSync(value);
    }

    #updateRotation(hologramName, value) {
        this.holograms.get(hologramName).changeRotationWithoutSync(value);
    }

    #updatePosition(hologramName, value) {
        this.holograms.get(hologramName).changePositionWithoutSync(value);
    }
}

const synchronizedElementUpdater = new SynchronizedElementUpdater();

export {synchronizedElementUpdater}