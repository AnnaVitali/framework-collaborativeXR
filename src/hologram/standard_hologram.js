import {Hologram} from "./hologram.js";
import {eventEmitter} from "../event/event_emitter.js";
import {Vector3} from "../utility/vector3.js";
import {synchronizedElementManager} from "../scene/synchronized_element_manager.js";

class StandardHologram extends Hologram{
    constructor(name, shapeName, creationOptions, position, rotation, color){
        super(name, position, rotation, new Vector3(1, 1, 1));
        this._creationOptions = creationOptions;
        this._shapeName = shapeName;
        this._color = color;
    }

    get shapeName() {
        return this._shapeName;
    }

    get creationOptions() {
        return this._creationOptions;
    }

    set color(value) {
        if(synchronizedElementManager.update) {
            this._color = value;
            eventEmitter.emit("colorChange", JSON.stringify({hologramName: this.name, color: this.color}));
        }
    }

    get color() {
        return this._color;
    }
}

export{ StandardHologram }