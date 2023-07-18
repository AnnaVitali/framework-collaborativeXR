/**
 * Utility class that represent a vector of three element.
 */
class Vector3{
    /**
     * Constructor of the class
     * @param x {Number} the value of the x variable.
     * @param y {Number} the value of the y variable.
     * @param z {Number} the value of the z variable.
     */
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    /**
     * Get the x of the vector.
     * @returns {Number}
     */
    get x() {
        return this._x;
    }

    /**
     * Get the y of the vector.
     * @returns {Number}
     */
    get y() {
        return this._y;
    }

    /**
     * Get the z of the vector.
     * @returns {Number}
     */
    get z() {
        return this._z;
    }
}

export {Vector3}