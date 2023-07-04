import {eventEmitter} from "../../event/event_emitter.js";
import {CroquetHologram} from "./croquet_hologram.js";

class CroquetImportedHologram extends CroquetHologram{

    constructor(name, meshFilePath, position, rotation, scaling){
        super(name, position, rotation)
        this._meshFilePath = meshFilePath;
        this._scaling = scaling;
    }

    get meshFilePath() {
        return this._meshFilePath;
    }

    get scaling() {
        return this._scaling;
    }

    set scaling(value) {
        this._scaling = value;
    }
}

export {CroquetImportedHologram}