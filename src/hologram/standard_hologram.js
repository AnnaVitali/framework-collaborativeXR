import {Hologram} from "./hologram.js";
import {eventEmitter} from "../event/event_emitter.js";

class StandardHologram extends Hologram{
    constructor(name, shapeName, creationOptions, position, rotation){
        super(name, position, rotation)
        this._creationOptions = creationOptions;
        this._shapeName = shapeName;
        this._color = "#ffffff";
    }

    get shapeName() {
        return this._shapeName;
    }

    get creationOptions() {
        return this._creationOptions;
    }

    set color(value) {
        this._color = value;
        eventEmitter.emit("colorChange", JSON.stringify({name: this.name, color: this.color}));
    }

    get color() {
        return this._color;
    }
}

export{ StandardHologram }