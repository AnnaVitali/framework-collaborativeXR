import {Menu} from "./menu.js";

/**
 * Class that represent a menu that can follow the user.
 */
class NearMenu extends Menu{
    /**
     * Constructor of the class.
     * @param position {Vector3} the positionSphere1 of the menu.
     * @param rows {Number} the number of rows in which the button are organized.
     */
    constructor(position, rows) {
        super(position);
        this.buttonList = [];
        this._rows = rows;
    }

    /**
     * Get the rows of the menu.
     * @returns {Number}
     */
    get rows() {
        return this._rows;
    }

    /**
     * Add a button to the menu.
     * @param button
     */
    addButton(button){
        this.buttonList.push(button);
    }
} 

export {NearMenu}