import {Hologram} from "./hologram.js";
import {eventEmitter} from "../event/event_emitter.js";
import {Vector3} from "../utility/vector3.js";

class StandardHologram extends Hologram{
    constructor(name, shapeName, creationOptions, position, rotation){
        super(name, position, rotation, new Vector3(1, 1, 1));
        this._creationOptions = creationOptions;
        this._shapeName = shapeName;
        this._color = "#ffffff";

        eventEmitter.emit("standardHologramCreate", JSON.stringify(this));
    }

    get shapeName() {
        return this._shapeName;
    }

    get creationOptions() {
        return this._creationOptions;
    }

    set color(value) {
        this._color = value;
        console.log("SEND: event color changed");
        eventEmitter.emit("colorChange", JSON.stringify({hologramName: this.name, color: this.color}));
    }

    get color() {
        return this._color;
    }
}

export{ StandardHologram }