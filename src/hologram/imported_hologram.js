import {eventEmitter} from "../event/event_emitter.js";
import {Hologram} from "./hologram.js";

class ImportedHologram extends Hologram{

    constructor(name, meshFilePath, position, rotation, scaling){
        super(name, position, rotation)
        this._meshFilePath = meshFilePath;
        this._scaling = scaling;

        eventEmitter.emit("importedHologramCreate", JSON.stringify(this));
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

export {ImportedHologram}