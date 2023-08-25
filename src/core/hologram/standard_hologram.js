import {Hologram} from "./hologram.js";
import {Vector3} from "../../utility/vector3.js";
import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";
import {coreEventManager} from "../utility/core_event_manager.js";

/**
 * Class representing a standard hologram created from a specific shape.
 */
class StandardHologram extends Hologram{

    /**
     * Constructor of the class.
     * @param name {String} the name of the class.
     * @param shapeName {string} the shape of reference.
     * @param creationOptions {Object} the creation options related to the shape.
     * @param position {Vector3} the hologram positionSphere1.
     * @param rotation {Quaternion} the hologram rotationSphere1.
     * @param color {String} the hologramColor.
     */
    constructor(name, shapeName, creationOptions, position, rotation, color){
        super(name, position, rotation, null);
        this._creationOptions = creationOptions;
        this._shapeName = shapeName;
        this._color = color;
    }

    /**
     * Get shape name.
     * @returns {StandardShape}
     */
    get shapeName() {
        return this._shapeName;
    }

    /**
     * Get creation options.
     * @returns {Object}
     */
    get creationOptions() {
        return this._creationOptions;
    }

    /**
     * Get the colorSphere of the hologram.
     * @returns {String}
     */
    get color() {
        return this._color;
    }

    /**
     * Set the colorSphere of the hologram.
     * @param value the new colorSphere.
     */
    set color(value) {
        if(synchronizedElementUpdater.update) {
            this._color = value;
            coreEventManager.sendEvent("colorChange", JSON.stringify({
                hologramName: this.name,
                color: this.color
            }));
        }
    }

    changeColorWithoutSync(value){
        this._color = value
    }
} 

export{ StandardHologram }