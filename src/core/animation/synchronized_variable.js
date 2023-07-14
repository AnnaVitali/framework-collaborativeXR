import {elementChecker} from "../utility/element_checker.js";
import {coreEventManager} from "../utility/core_event_manager.js";
import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";

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
        if(elementChecker.verifyNameAlreadyExist(name)){
            throw new Error("This name was already used!")
        }

        this._name = name;
        this._value = value;

        synchronizedElementUpdater.addSynchronizedVariable(this);
        coreEventManager.sendEvent("createSynchronizedVariable", JSON.stringify(this));
    }

    /**
     * Set the value of the variable.
     * @param value
     */
    set value(value) {
        if(synchronizedElementUpdater.update) {
            this._value = value;
            coreEventManager.sendEvent("valueChange", JSON.stringify({
                variableName: this.name,
                value: this.value
            }));
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