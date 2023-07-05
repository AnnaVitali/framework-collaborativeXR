class CroquetHologram {

    constructor(name, position, rotation){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._scale = new Vector3(1, 1, 1);
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = value;
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

export { CroquetHologram };