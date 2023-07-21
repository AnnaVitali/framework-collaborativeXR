import {Hologram} from "../../core/hologram/hologram.js";

/**
 * Class that represent a Hologram that can be used in the croquet model.
 */
class HologramClone{

    /**
     * Constructor of the class.
     * @param name {String} the name of the hologram.
     * @param position {Vector3} the positionSphere1 of the hologram in the world.
     * @param rotation {Quaternion} the rotationSphere1 of the hologram.
     * @param scaling {Vector3} the scal eof the hologram.
     */
    constructor(name, position, rotation, scaling){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._scaling = scaling;
    }

    /**
     * Get the name of the hologram.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the positionSphere1 of the hologram.
     * @returns {Vector3}
     */
    get position() {
        return this._position;
    }

    /**
     * Get the rotationSphere1 of the hologram.
     * @returns {Quaternion}
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * Get the scaling of the hologram.
     * @returns {Vector3}
     */
    get scaling() {
        return this._scaling;
    }

    /**
     * Set the name of the hologram.
     * @param value {String} the new name to assign.
     */
    set name(value) {
        this._name = value;
    }

    /**
     * Set the positionSphere1 of the hologram.
     * @param value the new positionSphere1.
     */
    set position(value) {
        this._position = value;
    }

    /**
     * Set the rotationSphere1 of the hologram.
     * @param value the new rotationSphere1.
     */
    set rotation(value) {
        this._rotation = value;
    }

    /**
     * Set the scaling of the hologram.
     * @param value the new scaling.
     */
    set scaling(value) {
        this._scaling = value;
    }
}

export { HologramClone };