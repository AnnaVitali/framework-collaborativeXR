import {HologramProperty} from "../hologram/enum/hologram_property.js";
import {coreEventManager} from "./core_event_manager.js";

class SynchronizedElementUpdater{
    /**
     * Empty constructor of the class.
     */
    constructor(){
        this.holograms = new Map();
        this.synchronizedVariables = new Map();

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
     * Add a synchronized variable to the synchronized element.
     * @param variable {SynchronizedVariable} the variable to add
     */
    addSynchronizedVariable(variable){
        this.synchronizedVariables.set(variable.name, variable);
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
     * Update the value of a synchronized variable.
     * @param variableName {String} the name of the variable.
     * @param value the value of the variable.
     */
    updateSynchronizedVariable(variableName, value){
        this.synchronizedVariables.get(variableName)._value = value;
    }
 
    #updateColor(hologramName, value) {
        this.holograms.get(hologramName)._color = value;
    }

    #updateScaling(hologramName, value) {
        this.holograms.get(hologramName)._scaling = value;
    }

    #updateRotation(hologramName, value) {
        this.holograms.get(hologramName)._rotation = value;
    }

    #updatePosition(hologramName, value) {
        this.holograms.get(hologramName)._position = value;
    }
}

const synchronizedElementUpdater = new SynchronizedElementUpdater();

export {synchronizedElementUpdater}