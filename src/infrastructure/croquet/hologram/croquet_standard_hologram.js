import {CroquetHologram} from "./croquet_hologram.js";

/**
 * Class representing a standard hologram created from a specific shape, that can be used in Croquet model.
 */
class CroquetStandardHologram extends CroquetHologram{
    /**
     * Constructor of the class.
     * @param name {String} the name of the class.
     * @param shapeName {StandardShape} the shape of reference.
     * @param creationOptions {Object} the creation options related to the shape.
     * @param position {Vector3} the hologram position.
     * @param rotation {Quaternion} the hologram rotation.
     * @param color {String} the hologramColor.
     */
    constructor(name, shapeName, creationOptions, position, rotation, color){
        super(name, position, rotation, null)
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
     * Get the color of the hologram.
     * @returns {String}
     */
    get color() {
        return this._color;
    }

    /**
     * Set the color of the hologram.
     * @param value the new color.
     */
    set color(value) {
        this._color = value;
    }
}

export{ CroquetStandardHologram }