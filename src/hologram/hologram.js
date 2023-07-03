class Hologram{

    constructor(name, position, rotation){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        this._rotation = value;
    }
}

export { Hologram };