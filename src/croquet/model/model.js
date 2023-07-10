import {eventEmitter} from "../../event/event_emitter.js";
import {HologramModel} from "./hologram_model.js";
import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";
import {CroquetSynchronizedVariable} from "../animation/croquet_synchronized_variable.js";
import {Vector3} from "../../utility/vector3.js";
import {SynchronizedVariableModel} from "./synchronized_variable_model.js";

const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        this.hologramInUserControl = new Map();
        this.hologramModel = HologramModel.create();
        this.synchronizedVariableModel = SynchronizedVariableModel.create();

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupViewEventHandlers();
    }

    addImportedHologram(data){
        this.#log("crateImportedHologram received");
        const hologram = Object.create(CroquetImportedHologram.prototype, Object.getOwnPropertyDescriptors(data.hologram));

        if(!this.hologramModel.holograms.has(hologram.name)) {
            this.hologramModel.addHologram(hologram);
        }

        this.publish(data.view, "showImportedHologram", hologram.name);
    }

    addStandardHologram(data){
        this.#log("crateStandardHologram received");
        const hologram = Object.create(CroquetStandardHologram.prototype, Object.getOwnPropertyDescriptors(data.hologram));
        this.#log("is present?" + this.hologramModel.holograms.has(hologram.name))

        if(!this.hologramModel.holograms.has(hologram.name)) {
            this.hologramModel.addHologram(hologram);
        }

        this.publish(data.view, "showStandardHologram", hologram.name);
    }

    addSynchronizedVariable(data){
        this.#log("crateStandardHologram received");
        const variable = Object.create(CroquetSynchronizedVariable.prototype, Object.getOwnPropertyDescriptors(data));

        console.log(this.synchronizedVariableModel.syncrhonizedVariables);

        if(!this.synchronizedVariableModel.syncrhonizedVariables.has(variable.name)) {
            this.synchronizedVariableModel.addVariable(variable);
            console.log(this.synchronizedVariableModel.syncrhonizedVariables);
        }

    }

    updateVariableValue(data){
        this.#log("update hologram color received");
        const variableName = data.variableName;
        const value = data.value;

        this.synchronizedVariableModel.updateValue(variableName, value);
    }

    updateHologramColor(data){
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const color = data.color;

        this.hologramModel.updateColor(hologramName, color);
    }

    updateHologramScaling(data){
        this.#log("update hologram scaling received");
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const scaling = data.scaling;

        this.hologramModel.updateScale(hologramName, scaling);
    }

    updateHologramPosition(data){
        this.#log("update hologram position received");
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const position = data.position;

        this.hologramModel.updatePosition(hologramName, position);
    }

    updateHologramRotation(data){
        this.#log("update hologram rotation received");
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const rotation = data.rotation;

        if(this.hologramModel.get(hologramName).rotation !== rotation) {
            this.hologramModel.updateRotation(hologramName, rotation);
        }
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
        this.#log("viewId " + viewId);
        const values = [...this.hologramInUserControl.values()]
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        if(viewId === this.viewInCharge){
            this.viewInCharge = this.linkedViews.indexOf(0);
            this.publish(this.viewInCharge, "setUpdate");
        }

        if(values.includes(viewId)){
            this.hologramInUserControl.forEach((v, k)=>{
                if(v === viewId){
                    this.manageUserHologramControlReleased({view: v, hologramName: k});
                }
            });
        }
    }

    /**
     * Manage the control of the hologram from the user.
     * @param {any} data object that contains the id of the view in control.
     */
    manageUserHologramControl(data){
        this.#log("received manage user hologram control");
        this.hologramInUserControl.set(data.hologramName, data.view);
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
        this.hologramInUserControl.delete(data.hologramName);
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "restoreControlButton", {hologramName: data.hologramName});
        });
    }

    setViewInCharge(data){
        this.viewInCharge = data;
    }

    #setupViewEventHandlers(){
        this.subscribe("create", "importedHologram", this.addImportedHologram);
        this.subscribe("create", "standardHologram", this.addStandardHologram);
        this.subscribe("create", "synchronizedVariable", this.addSynchronizedVariable);

        this.subscribe("updateHologram", "changeColor", this.updateHologramColor);
        this.subscribe("updateHologram", "changeScaling", this.updateHologramScaling);
        this.subscribe("updateHologram", "changePosition", this.updateHologramPosition);
        this.subscribe("updateHologram", "changeRotation", this.updateHologramRotation);

        this.publish("synchronizedVariable", "valueChange", this.updateVariableValue)

        this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
        this.subscribe("hologramManipulation", "positionChanged", this.requireHologramPositionUpdate);
        this.subscribe("hologramManipulation", "scaleChanged", this.requireHologramScaleUpdate);

        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
        this.subscribe("controlButton", "clicked", this.manageUserHologramControl);

        this.publish("view", "viewInCharge", this.setViewInCharge);
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