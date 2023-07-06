import {eventEmitter} from "../../event/event_emitter.js";
import {StandardShape} from "../../hologram/standard_shape.js";
import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";

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
        this.holograms.get(hologramName).position = position;
    }

    updateScale(hologramName, scale){
        this.holograms.get(hologramName).scale = scale;
    }

    changeColorHologram(hologramName, color){
        this.#log("change hologram color received");
        this.#log(hologramName)
        console.log(this.holograms);
        console.log(this.holograms.get(hologramName));
        this.holograms.get(hologramName).color = color;

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