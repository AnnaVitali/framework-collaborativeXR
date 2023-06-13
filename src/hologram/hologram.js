import {eventEmitter} from "../event/event_emitter.js";

class Hologram{

    constructor(meshFilePath, position, rotation, scaling){
        this._meshFilePath = meshFilePath;
        this._position = position;
        this._rotation = rotation;
        this._scaling = scaling;
    }


    get meshFilePath() {
        return this._meshFilePath;
    }

    set meshFilePath(value) {
        this._meshFilePath = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        this._rotation = value;
    }

    get scaling() {
        return this._scaling;
    }

    set scaling(value) {
        this._scaling = value;
    }
}

export {Hologram}