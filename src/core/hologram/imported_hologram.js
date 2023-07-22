import {Hologram} from "./hologram.js";

/**
 * Class that represents an imported hologram associated with a file that adjusts its graphical rendering.
 */
class ImportedHologram extends Hologram{

    /**
     * Constructor of the class.
     * @param name {String} the name of the hologram.
     * @param meshFilePath {String} the file path for the rendering process.
     * @param position {Vector3} the positionSphere1 of the hologram.
     * @param rotation {Quaternion} the rotationSphere1 of the hologram.
     * @param scaling {Vector3} the scaling of the hologram
     */
    constructor(name, meshFilePath, position, rotation, scaling){
        super(name, position, rotation, scaling)
        this._meshFilePath = meshFilePath;
    }

    /**
     * Get the file path for teh rendering process.
     * @returns {String}
     */
    get meshFilePath() {
        return this._meshFilePath;
    }
}

export {ImportedHologram}