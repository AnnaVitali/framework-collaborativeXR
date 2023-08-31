import {coreEventManager} from "../utility/core_event_manager.js";
import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";

/**
 * Class representing a standard object for the application.
 */
class StandardObject{
    /**
     * Constructor of the class.
     * @param name {String} the name of the object.
     * @param value the value to assign.
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }

    /**
     * Set the value of the object.
     * @param value
     */
    set value(value) {
        this._value = value;
        coreEventManager.sendEvent("valueChange", JSON.stringify({
            variableName: this.name,
            value: this.value
        }));

    }

    /**
     * Change the value without synchronizing with the other users.
     * @param value the new value.
     */
    changeValueWithoutSync(value){
        this._value = value;
    }

    /**
     * Get the name of the object.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the value of the object.
     * @returns {*}
     */
    get value() {
        return this._value;
    }
} 

export {StandardObject}