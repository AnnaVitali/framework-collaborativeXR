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

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get z() {
        return this._z;
    }

    set z(value) {
        this._z = value;
    }

    get w() {
        return this._w;
    }

    set w(value) {
        this._w = value;
    }
}

export {Quaternion}