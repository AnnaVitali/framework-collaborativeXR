import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";
import {eventBus} from "../../../event/event_emitter.js";

/**
 * Class that represents a model for the holograms in the scene.
 */
class HologramModel extends Croquet.Model {

    /**
     * Init method of the model.
     * @param options {Object} creation options.
     */
    init(options = {}){
        super.init();
        this.holograms = new Map();

        //this.#setupBackEndEventHandlers();
    }

    /**
     * Add a hologram to the list
     * @param hologram {CroquetHologram} the hologram to add
     */
    addHologram(hologram){
        if(!this.holograms.has(hologram.name)) {
            this.holograms.set(hologram.name, hologram);
        }else{
            throw new Error("Hologram with this name already present!");
        }
    }

    /**
     * Update the hologram position.
     * @param hologramName {String} the name of reference for the hologram.
     * @param position {Vector3} the new position.
     */
    updatePosition(hologramName, position){
        try {
            this.holograms.get(hologramName).position = position;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventBus.emit("updatePosition", JSON.stringify({hologramName: hologramName, position: position}));
        this.publish("view", "updateHologramPosition", hologramName);
    }

    /**
     * Update the scale of the hologram.
     * @param hologramName {String} the name of reference for the hologram.
     * @param scale {Vector3} the new scale.
     */
    updateScale(hologramName, scale){
        try {
            this.holograms.get(hologramName).scale = scale;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventBus.emit("updateScaling", JSON.stringify({hologramName: hologramName, scale: scale}));
        this.publish("view", "updateHologramScaling", hologramName);
    }

    /**
     * Update the rotation of the hologram
     * @param hologramName {String} the name of reference of the hologram.
     * @param rotation {Quaternion} the new rotation.
     */
    updateRotation(hologramName, rotation){
        try {
            this.holograms.get(hologramName).rotation = rotation;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventBus.emit("updateRotation", JSON.stringify({hologramName: hologramName, rotation: rotation}));
        this.publish("view", "updateHologramRotation", hologramName);
    }

    /**
     * Update the color of the hologram
     * @param hologramName {String} the name o reference for the hologram.
     * @param color {String} the color to apply.
     */
    updateColor(hologramName, color){
        this.#log("change hologram color received");
        try {
            this.holograms.get(hologramName).color = color;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventBus.emit("updateColor", JSON.stringify({hologramName: hologramName, color: color}));
        this.publish("view", "updateHologramColor", hologramName);
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("SH-MODEL: " + message);
        }
    }

    static types() {
        return {
            "CroquetStandardHologram": CroquetStandardHologram,
            "CroquetImportedHologram": CroquetImportedHologram,
        };
    }
}

HologramModel.register("HologramModel");


export {HologramModel};