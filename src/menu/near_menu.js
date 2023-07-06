import {Menu} from "./menu.js";

class NearMenu extends Menu{
    constructor(position, rows) {
        super(position);
        this.buttonList = [];
        this._rows = rows;
    }


    get rows() {
        return this._rows;
    }

    addButton(button){
        this.buttonList.push(button);
    }
}

export {NearMenu}