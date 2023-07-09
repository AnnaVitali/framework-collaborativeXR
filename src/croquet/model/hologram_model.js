import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";
import {eventEmitter} from "../../event/event_emitter.js";

class HologramModel extends Croquet.Model {

    init(options = {}){
        super.init();
        this.holograms = new Map();

        //this.#setupBackEndEventHandlers();
    }

    addHologram(hologram){
        if(!this.holograms.has(hologram.name)) {
            this.holograms.set(hologram.name, hologram);
        }else{
            throw new Error("Hologram with this name already present!");
        }
    }

    updatePosition(hologramName, position){
        try {
            this.holograms.get(hologramName).position = position;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventEmitter.emit("updatePosition", JSON.stringify({hologramName: hologramName, position: position}));
        this.publish("view", "updateHologramPosition", hologramName);
    }

    updateScale(hologramName, scale){
        try {
            this.holograms.get(hologramName).scale = scale;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventEmitter.emit("updateScaling", JSON.stringify({hologramName: hologramName, scale: scale}));
        this.publish("view", "updateHologramScaling", hologramName);
    }

    updateRotation(hologramName, rotation){
        try {
            this.holograms.get(hologramName).rotation = rotation;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventEmitter.emit("updateRotation", JSON.stringify({hologramName: hologramName, rotation: rotation}));
        this.publish("view", "updateHologramRotation", hologramName);
    }

    updateColor(hologramName, color){
        this.#log("change hologram color received");
        try {
            this.holograms.get(hologramName).color = color;
        }catch(error){
            //silently ignore, if the user join the session at the same time everything works
        }

        eventEmitter.emit("updateColor", JSON.stringify({hologramName: hologramName, color: color}));
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