/**
 * Class that represent a Hologram that can be used in the croquet model.
 */
class CroquetHologram {

    /**
     * Constructor of the class.
     * @param name {String} the name of the hologram.
     * @param position {Vector3} the position of the hologram in the world.
     * @param rotation {Quaternion} the rotation of the hologram.
     * @param scaling {Vector3} the scal eof the hologram.
     */
    constructor(name, position, rotation, scaling){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._scaling = scaling;
    }

    /**
     * Get the scaling of the hologram.
     * @returns {Vector3}
     */
    get scaling() {
        return this._scaling;
    }

    /**
     * Get the name of the hologram.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the rotation of the hologram.
     * @returns {Quaternion} the new rotation.
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * Get the position of the hologram.
     * @returns {Vector3}
     */
    get position() {
        return this._position;
    }

    /**
     * Set the name of the hologram.
     * @param value {String} the new name to assign.
     */
    set name(value) {
        this._name = value;
    }

    /**
     * Set the position of the hologram.
     * @param value the new position.
     */
    set position(value) {
        this._position = value;
    }

    /**
     * Set the rotation of the hologram.
     * @param value the new rotation.
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

export { CroquetHologram };