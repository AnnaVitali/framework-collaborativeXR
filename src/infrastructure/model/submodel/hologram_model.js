
import {infrastructureEventManager} from "../../utility/infrastructure_event_manager.js";
import {Vector3} from "../../../utility/vector3.js";
import {Quaternion} from "../../../utility/quaternion.js";
import {ImportedHologram} from "../../../core/hologram/imported_hologram.js";
import {StandardHologram} from "../../../core/hologram/standard_hologram.js";

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
        this.linkedViews = [];
        this.hologramInUserControl = new Map();

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupViewEventHandlers();
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        this.#log("received view join");
        this.linkedViews.push(viewId);
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        this.#log("received view left");
        const values = [...this.hologramInUserControl.values()]
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);

        if(values.includes(viewId)){
            this.hologramInUserControl.forEach((v, k)=>{
                if(v === viewId){
                    this.manageUserHologramControlReleased({view: v, hologramName: k});
                }
            });
        }
    }

    /**
     * Add a new imported hologram
     * @param data {Object} object containing the data of the hologram.
     */
    addImportedHologram(data){
        const hologram = Object.create(ImportedHologram.prototype, Object.getOwnPropertyDescriptors(data.hologram));
        const view = data.view
        this.#addHologram(hologram, view);
        this.publish(view, "showImportedHologram", hologram.name);
    }

    /**
     * Add a new standard hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    addStandardHologram(data){
        const hologram = Object.create(StandardHologram.prototype, Object.getOwnPropertyDescriptors(data.hologram));
        const view = data.view
        this.#addHologram(hologram, view);
        this.publish(view, "showStandardHologram", hologram.name);
    }

    /**
     * Update the positionSphere1 of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updatePosition(data){
        const hologramName = data.hologramName;
        const position = data.position
        this.holograms.get(hologramName).changePositionWithoutSync(position);

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
        this.holograms.get(hologramName).changeScalingWithoutSync(scaling);

        infrastructureEventManager.sendEvent("updateScaling", JSON.stringify({hologramName: hologramName, scale: scaling}));
        this.publish("view", "updateHologramScaling", hologramName);
    }

    /**
     * Update the rotationSphere1 of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updateRotation(data){
        const hologramName = data.hologramName;
        const rotation = data.rotation
        this.holograms.get(hologramName).changeRotationWithoutSync(rotation);

        infrastructureEventManager.sendEvent("updateRotation", JSON.stringify({hologramName: hologramName, rotation: rotation}));
        this.publish("view", "updateHologramRotation", hologramName);
    }

    /**
     * Update the colorSphere of the hologram.
     * @param data {Object} object containing the data of the hologram.
     */
    updateColor(data){
        const hologramName = data.hologramName;
        const color = data.color;
        this.holograms.get(hologramName).changeColorWithoutSync(color);

        infrastructureEventManager.sendEvent("updateColor", JSON.stringify({hologramName: hologramName, color: color}));
        this.publish("view", "updateHologramColor", hologramName);
    }

    /**
     * Require to show user manipulation.
     * @param data {Object} object containing the data of the hologram and the view.
     */
    requireShowUserManipulation(data){
        this.#log("received showUserManipulation");

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showUserManipulation", {hologramName: data.hologramName});
        });

    }

    /**
     * Manage the control of the hologram from the user.
     * @param data {Object} object that contains the id of the view in control.
     */
    manageUserHologramControlRequired(data){
        this.#log("received manage user hologram control");
        this.hologramInUserControl.set(data.hologramName, data.view);
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "freezeControlButton", {hologramName: data.hologramName});
        });
    }

    /**
     * Manage the release of the control from the user who had it.
     * @param data {Object} object that contains the id of the view where the user released the control.
     */
    manageUserHologramControlReleased(data){
        this.#log("received manage user hologram control released");
        this.hologramInUserControl.delete(data.hologramName);
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "restoreControlButton", {hologramName: data.hologramName});
        });
    }


    /**
     * Update the hologram positionSphere1 due to a manipulation.
     * @param data {Object} object containing the data of the hologram.
     */
    updateHologramPositionAfterManipulation(data){
        this.#log("received requireHologramUpdate");
        const hologramName = data.hologramName;
        const position = new Vector3(data.position_x, data.position_y, data.position_z)
        this.holograms.get(hologramName).changePositionWithoutSync(position);

        infrastructureEventManager.sendEvent("updatePosition", JSON.stringify({hologramName: hologramName, position: position}));
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedPosition", hologramName);
        });
    }

    /**
     * Update the scaling of the hologram due to a manipulation.
     * @param data {Object} object containing the data of the hologram.
     */
    updateHologramScalingAfterManipulation(data){
        this.#log("received requireHologramUpdate");
        const hologramName = data.hologramName;
        const scaling = new Vector3(data.scale_x, data.scale_y, data.scale_z)
        this.holograms.get(hologramName).changeScalingWithoutSync(scaling);

        infrastructureEventManager.sendEvent("updateScaling", JSON.stringify({hologramName: hologramName, scale: scaling}));
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedScaling", hologramName);
        });
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

        this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
        this.subscribe("hologramManipulation", "positionChanged", this.updateHologramPositionAfterManipulation);
        this.subscribe("hologramManipulation", "scaleChanged", this.updateHologramScalingAfterManipulation);

        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
        this.subscribe("controlButton", "clicked", this.manageUserHologramControlRequired);
    }

    #log(message){
        const debug = false;
        if(debug){
            console.log("H-MODEL: " + message);
        }
    }

    static types() {
        return {
            "StandardHologram": StandardHologram,
            "ImportedHologram": ImportedHologram,
            "Vector3": Vector3,
            "Quaternion": Quaternion,
        };
    }
} 

HologramModel.register("HologramModel");


export {HologramModel};