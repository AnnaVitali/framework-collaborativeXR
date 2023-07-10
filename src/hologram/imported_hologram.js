import {eventEmitter} from "../event/event_emitter.js";
import {Hologram} from "./hologram.js";

class ImportedHologram extends Hologram{

    constructor(name, meshFilePath, position, rotation, scaling){
        super(name, position, rotation, scaling)
        this._meshFilePath = meshFilePath;
    }

    get meshFilePath() {
        return this._meshFilePath;
    }
}

export {ImportedHologram}