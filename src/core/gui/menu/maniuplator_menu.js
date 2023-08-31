import {Menu} from "./menu.js";

/**
 * Class representing a Menu that allow to manipulate a hologram.
 */
class ManipulatorMenu extends Menu{
    /**
     * Constructor of the class.
     * @param position {Vector3} the position of the menu.
     * @param hologramName {String} the name of the hologram to manipulate.
     */
    constructor(position, hologramName) {
        super(position);
        this._position = position;
        this._hologramName = hologramName;
    }

    /**
     * Get the name to which the menu is associated.
     * @returns {String}
     */
    get hologramName() {
        return this._hologramName;
    }
}

export {ManipulatorMenu}