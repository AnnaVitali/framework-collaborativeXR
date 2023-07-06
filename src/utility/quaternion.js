class Quaternion{
    constructor(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    get w() {
        return this._w;
    }

}

export {Quaternion}