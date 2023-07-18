import {SynchronizedVariable} from "../../core/synchronizedVariable/synchronized_variable.js";

/**
 * Class representing a synchronized variable to use in the Croquet Model.
 */
class SynchronizedVariableClone{
    /**
     * Constructor of the class.
     * @param name {String} the name of the variable.
     * @param value the value to assign.
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;
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

    /**
     * Set the value of the variable.
     * @param value
     */
    set value(value) {
        this._value = value;
    }
}

export {SynchronizedVariableClone}