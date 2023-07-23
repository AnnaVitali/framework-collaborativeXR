/**
 * Utility class that represent a Triple.
 */
class Triple {
    /**
     * Constructor of the class
     * @param x the value of the x variable.
     * @param y the value of the y variable.
     * @param z the value of the z variable.
     */
    constructor(x, y, z) {

        this._x = x;
        this._y = y;
        this._z = z;
    }

    /**
     * Get the x of the triple.
     * @returns {*}
     */
    get x() {
        return this._x;
    }

    /**
     * Get the y of the triple.
     * @returns {*}
     */
    get y() {
        return this._y;
    }

    /**
     * Get the z of the triple
     * @returns {*}
     */
    get z() {
        return this._z;
    }
}

export {Triple}