class Hologram{

    constructor(name, position, rotation, scaling){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._scaling = scaling;
    }

    get scaling() {
        return this._scaling;
    }

    set scaling(value) {
        this._scaling = value;
    }

    get name() {
        return this._name;
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

    updatePosition(position){
        this._position = position;
    }

    updateRotation(rotation){
        this._rotation = rotation;
    }

    updateScaling(scaling){
        this._scaling = scaling;
    }
}

export { Hologram };