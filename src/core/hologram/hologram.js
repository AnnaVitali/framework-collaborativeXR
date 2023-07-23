import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";
import {coreEventManager} from "../utility/core_event_manager.js";

/**
 * Class that represent a Hologram that can be rendered.
 */
class Hologram{

    /**
     * Constructor of the class.
     * @param name {String} the name of the hologram.
     * @param position {Vector3} the position of the hologram in the world.
     * @param rotation {Quaternion} the rotation of the hologram.
     * @param scaling {Vector3} the scaling of the hologram.
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
     * Get the rotation of the hologram.
     * @returns {Quaternion} the new rotation.
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * Get the name of the hologram.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the position of the hologram.
     * @returns {Vector3}
     */
    get position() {
        return this._position;
    }

    /**
     * Set the scaling of the hologram.
     * @param value the new scaling.
     */
    set scaling(value) {
        if(synchronizedElementUpdater.update) {
            this._scaling = value;
            coreEventManager.sendEvent("scalingChange", JSON.stringify({
                hologramName: this.name,
                scaling: this.scaling
            }));
        }
    }

    /**
     * Set the position of the hologram.
     * @param value the new position.
     */
    set position(value) {
        if(synchronizedElementUpdater.update) {
            this._position = value;
            coreEventManager.sendEvent("positionChange", JSON.stringify({
                hologramName: this.name,
                position: this.position
            }));
        }
    }

    /**
     * Set the rotation of the hologram.
     * @param value the new rotation.
     */
    set rotation(value) {
        if(synchronizedElementUpdater.update) {
            this._rotation = value;
            coreEventManager.sendEvent("rotationChange", JSON.stringify({
                hologramName: this.name,
                rotation: this.rotation
            }));
        }
    }
}

export { Hologram }