import {StandardHologramClone} from "../../../hologram/standard_hologram_clone.js";
import {ImportedHologramClone} from "../../../hologram/imported_hologram_clone.js";
import {infrastructureEventManager} from "../../../utility/infrastructure_event_manager.js";

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

        this.#setupViewEventHandlers();
    }

    /**
     * Add a new imported hologram
     * @param data {Object} object containing the data of the hologram.
     */
    addImportedHologram(data){
        const hologram = Object.create(ImportedHologramClone.prototype, Object.getOwnPropertyDescriptors(data.hologram));
        const view = data.view
        this.#addHologram(hologram, view);
        this.publish(view, "showImportedHologram", hologram.name);
    }

    /**
     * Add a new standard hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    addStandardHologram(data){
        const hologram = Object.create(StandardHologramClone.prototype, Object.getOwnPropertyDescriptors(data.hologram));
        const view = data.view
        this.#addHologram(hologram, view);
        this.publish(view, "showStandardHologram", hologram.name);
    }

    /**
     * Update the position of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updatePosition(data){
        const hologramName = data.hologramName;
        const position = data.position
        this.holograms.get(hologramName).position = position;

        infrastructureEventManager.sendEvent("updatePosition", JSON.stringify({hologramName: hologramName, position: position}));
        this.publish("view", "updateHologramPosition", hologramName);
    }

    /**
     * Update the scaling of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updateScaling(data){
        const hologramName = data.hologramName;
        const scaling = data.scaling;
        this.holograms.get(hologramName).scaling = scaling;

        infrastructureEventManager.sendEvent("updateScaling", JSON.stringify({hologramName: hologramName, scale: scaling}));
        this.publish("view", "updateHologramScaling", hologramName);
    }

    /**
     * Update the rotation of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updateRotation(data){
        const hologramName = data.hologramName;
        const rotation = data.rotation
        this.holograms.get(hologramName).rotation = rotation;

        infrastructureEventManager.sendEvent("updateRotation", JSON.stringify({hologramName: hologramName, rotation: rotation}));
        this.publish("view", "updateHologramRotation", hologramName);
    }

    /**
     * Update the color of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updateColor(data){
        const hologramName = data.hologramName;
        const color = data.color;

        this.holograms.get(hologramName).color = color;

        infrastructureEventManager.sendEvent("updateColor", JSON.stringify({hologramName: hologramName, color: color}));
        this.publish("view", "updateHologramColor", hologramName);
    }

    /**
     * Update the hologram position due to a manipulation.
     * @param hologramName {String} the name of the hologram.
     * @param position {Vector3} the new position.
     */
    updateHologramPositionManipulation(hologramName, position){
        this.holograms.get(hologramName).position = position;
    }

    /**
     * Update the scaling of the hologram due to a manipulation.
     * @param hologramName {String} the name of the hologram.
     * @param scaling {Vector3} the new scaling.
     */
    updateHologramScalingManipulation(hologramName, scaling){
        this.holograms.get(hologramName).scaling = scaling;
    }

    #addHologram(hologram){
        if(!this.holograms.has(hologram.name)) {
            this.holograms.set(hologram.name, hologram);
        }
    }

    #setupViewEventHandlers(){
        this.subscribe("create", "importedHologram", this.addImportedHologram);
        this.subscribe("create", "standardHologram", this.addStandardHologram);

        this.subscribe("updateHologram", "changeColor", this.updateColor);
        this.subscribe("updateHologram", "changeScaling", this.updateScaling);
        this.subscribe("updateHologram", "changePosition", this.updatePosition);
        this.subscribe("updateHologram", "changeRotation", this.updateRotation);
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("SH-MODEL: " + message);
        }
    }

    static types() {
        return {
            "CroquetStandardHologram": StandardHologramClone,
            "CroquetImportedHologram": ImportedHologramClone,
        };
    }
}

HologramModel.register("HologramModel");


export {HologramModel};