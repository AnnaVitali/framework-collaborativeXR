import {eventEmitter} from "../event/event_emitter.js";
import {synchronizedElementManager} from "../scene/synchronized_element_manager.js";

class Hologram{

    constructor(name, position, rotation, scaling){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._scaling = scaling;
    }

    get scaling() {
        return this._scaling;
    }

    set scaling(value) {
        if(synchronizedElementManager.update) {
            this._scaling = value;
            eventEmitter.emit("scalingChange", JSON.stringify({hologramName: this.name, scaling: this.scaling}));
        }
    }

    get name() {
        return this._name;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        if(synchronizedElementManager.update) {
            this._position = value;
            eventEmitter.emit("positionChange", JSON.stringify({hologramName: this.name, position: this.position}));
        }
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        if(synchronizedElementManager.update) {
            this._rotation = value;
            eventEmitter.emit("rotationChange", JSON.stringify({hologramName: this.name, rotation: this.rotation}));
        }
    }
}

export { Hologram };