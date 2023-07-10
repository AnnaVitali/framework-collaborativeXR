import {Menu} from "./menu.js";

/**
 * Class representing a Menu that allow to manipulate an hologram.
 */
class ManipulatorMenu extends Menu{
    /**
     * Constructor of the class.
     * @param position {Vector3} the position of the menu
     */
    constructor(position) {
        super(position);
        this._position = position;
    }

}

export {ManipulatorMenu}