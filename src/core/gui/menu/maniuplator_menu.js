import {Menu} from "./menu.js";

/**
 * Class representing a Menu that allow to manipulate an hologram.
 */
class ManipulatorMenu extends Menu{
    /**
     * Constructor of the class.
     * @param position {Vector3} the positionSphere1 of the menu
     * @param hologramName {String} the name of the hologram to manipulate.
     */
    constructor(position, hologramName) {
        super(position);
        this._position = position;
        this._hologramName = hologramName;
    }

    get hologramName() {
        return this._hologramName;
    }
}

export {ManipulatorMenu}