import {eventEmitter} from "../event/event_emitter.js";
import {synchronizedElementManager} from "../scene/synchronized_element_manager.js";

class SynchronizedVariable{
    constructor(name, value) {
        this._name = name;
        this._value = value;

        synchronizedElementManager.addSynchronizedVariable(this);
        eventEmitter.emit("createSynchronizedVariable", JSON.stringify(this));
    }

    set value(value) {
        if(synchronizedElementManager.update) {
            this._value = value;
            eventEmitter.emit("valueChange", JSON.stringify({variableName: this.name, value: this.value}));
        }
    }

    get name() {
        return this._name;
    }

    get value() {
        return this._value;
    }
}

export {SynchronizedVariable}