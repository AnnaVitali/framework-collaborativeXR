/**
 * Class representing a menu that can be added to the scene.
 */
class Menu{
    /**
     * Constructor of the class.
     * @param position {Vector3} the positionSphere1 of the menu.
     */
    constructor(position){
        this._position = position;
    }

    /**
     *
     * @returns {Vector3}
     */
    get position() {
        return this._position;
    }
}

export {Menu}