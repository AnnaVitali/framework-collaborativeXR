import {eventBus} from "../../event/event_emitter.js";
import {synchronizedElementManager} from "../scene/utility/synchronized_element_manager.js";

/**
 * Class representing a synchronized variable for the application.
 */
class SynchronizedVariable{
    /**
     * Constructor of the class.
     * @param name {String} the name of the variable.
     * @param value the value to assign.
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;

        synchronizedElementManager.addSynchronizedVariable(this);
        eventBus.emit("createSynchronizedVariable", JSON.stringify(this));
    }

    /**
     * Set the value of the variable.
     * @param value
     */
    set value(value) {
        if(synchronizedElementManager.update) {
            this._value = value;
            eventBus.emit("valueChange", JSON.stringify({variableName: this.name, value: this.value}));
        }
    }

    /**
     * Get the name of the variable.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the value of the variable.
     * @returns {*}
     */
    get value() {
        return this._value;
    }
}

export {SynchronizedVariable}