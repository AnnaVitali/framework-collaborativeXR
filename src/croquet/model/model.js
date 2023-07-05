import {eventEmitter} from "../../event/event_emitter.js";
import {HologramModel} from "./hologram_model.js";
import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";
import {Vector3} from "../../utility/vector3.js";

const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        this.hologramModel = HologramModel.create();

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupBackEndEventHandlers();
        this.#setupViewEventHandlers();
    }

    #addImportedHologram(data){
        this.#log("crateImportedHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetImportedHologram.prototype, Object.getOwnPropertyDescriptors(object));

        this.hologramModel.addHologram(hologram);
    }

    #addStandardHologram(data){
        this.#log("crateStandardHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetStandardHologram.prototype, Object.getOwnPropertyDescriptors(object));

        this.hologramModel.addHologram(hologram);
    }

    updateHologramColor(data){
        this.#log("update hologram color received");
        const object = JSON.parse(data);
        const hologramName = object.hologramName;
        const color = object.color;

        this.hologramModel.changeColorHologram(hologramName, color);
    }

    requireHologramPositionUpdate(data){
        this.#log("received requireHologramUpdate");

        const hologramName = data.hologramName;
        const position = new Vector3(data.position_x, data.position_y, data.position_z);

        this.hologramModel.updatePosition(hologramName, position);

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedPosition", hologramName);
        });
    }

    requireHologramScaleUpdate(data){
        this.#log("received requireHologramUpdate");

        const hologramName = data.hologramName;
        const scale = new Vector3(data.scale_x, data.scale_y, data.scale_z);

        this.hologramModel.updateScale(hologramName, scale);

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedScale", hologramName);
        });
    }

    requireShowUserManipulation(data){
        this.#log("received showUserManipulation");
        this.#log(data.view);

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showUserManipulation", {hologramName: data.hologramName});
        });

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
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        if(this.linkedViews.length === 0){
            this.destroy();
        }
    }

    /**
     * Manage the control of the hologram from the user.
     * @param {any} data object that contains the id of the view in control.
     */
    manageUserHologramControl(data){
        this.#log("received manage user hologram control");
        this.#log("data:");
        this.#log(data);
        this.isUserManipulating = true;
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "freezeControlButton", {hologramName: data.hologramName});
        });
    }

    /**
     * Manage the relase of the control from the user who had it.
     * @param {any} data object that contains the id of the view where the user released the control.
     */
    manageUserHologramControlReleased(data){
        this.#log("received manage user hologram control released");

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "restoreControlButton", {hologramName: data.hologramName});
        });
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("importedHologramCreate", (data)=>{
            this.#log("createImportedHologram model");
            this.#addImportedHologram(data);
        });

        eventEmitter.on("standardHologramCreate", (data) => {
            this.#log("createStandardHologramModel");
            this.#addStandardHologram(data);
        } );
    }

    #setupViewEventHandlers(){
        this.subscribe("updateHologram", "changeColor", this.updateHologramColor);
        this.subscribe("controlButton", "clicked", this.manageUserHologramControl);
        this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
        this.subscribe("updateHologram", "positionChanged", this.requireHologramPositionUpdate);
        this.subscribe("updateHologram", "scaleChanged", this.requireHologramScaleUpdate);
        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);

    }


    #log(message){
        const debug = true;
        if(debug){
            console.log("MODEL: " + message);
        }
    }

    static types() {
        return {
            "BABYLON.GUI.GUI3DManager": BABYLON.GUI.GUI3DManager,
            "Map": Map,
        };
    }

}


RootModel.register("RootModel");


export {RootModel};