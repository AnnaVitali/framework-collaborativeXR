/**
 * Utility class that represent a quaternion.
 */
class Quaternion{
    /**
     * Constructor of the class.
     * @param x {Number} the value for the first variable.
     * @param y {Number} the value for the second variable.
     * @param z {Number} the value for the third variable.
     * @param w {Number} the value for the fourth variable.
     */
    constructor(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    /**
     * Get the cx of the quaternion.
     * @returns {Number}
     */
    get x() {
        return this._x;
    }

    /**
     * Get the y of the quaternion.
     * @returns {Number}
     */
    get y() {
        return this._y;
    }

    /**
     * Get the z of the quaternion
     * @returns {Number}
     */
    get z() {
        return this._z;
    }

    /**
     * Get the w of the quaternion.
     * @returns {Number}
     */
    get w() {
        return this._w;
    }

}

export {Quaternion}