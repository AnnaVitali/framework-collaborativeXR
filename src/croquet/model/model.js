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
        this.hologramModel = HologramModel.create();
        this.synchronizedVariableModel = SynchronizedVariableModel.create();
        this.animationModels = [];

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupBackEndEventHandlers();
        this.#setupViewEventHandlers();
    }

    #addImportedHologram(data){
        this.#log("crateImportedHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetImportedHologram.prototype, Object.getOwnPropertyDescriptors(object));

        if(!this.hologramModel.hologramsManipulatorMenu.has(hologram.name)) {
            this.hologramModel.addHologram(hologram);
        }
    }

    #addStandardHologram(data){
        this.#log("crateStandardHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetStandardHologram.prototype, Object.getOwnPropertyDescriptors(object));

        if(!this.hologramModel.holograms.has(hologram.name)) {
            this.hologramModel.addHologram(hologram);
        }
    }

    #addSynchronizedVariable(data){
        this.#log("crateStandardHologram received");
        const object = JSON.parse(data);
        const variable = Object.create(CroquetSynchronizedVariable.prototype, Object.getOwnPropertyDescriptors(object));

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

        if(this.synchronizedVariableModel.syncrhonizedVariables.get(variableName).value !== value) {
            this.synchronizedVariableModel.updateValue(variableName, value);
        }
    }

    updateHologramColor(data){
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const color = data.color;

        if(this.hologramModel.holograms.get(hologramName).color !== color) {
            this.hologramModel.updateColor(hologramName, color);
        }
    }

    updateHologramScaling(data){
        this.#log("update hologram scaling received");
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const scaling = data.scaling;

        if(this.hologramModel.get(hologramName).scaling !== scaling) {
            this.hologramModel.updateScale(hologramName, scaling);
        }
    }

    updateHologramPosition(data){
        this.#log("update hologram position received");
        this.#log("update hologram color received");
        const hologramName = data.hologramName;
        const position = data.position;

        if(this.hologramModel.get(hologramName).position !== position){
            this.hologramModel.updatePosition(hologramName, position);
        }
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
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        if(viewId === this.viewInCharge){
            this.viewInCharge = this.linkedViews.indexOf(0);
            this.publish(this.viewInCharge, "setUpdate");
        }
    }

    /**
     * Manage the control of the hologram from the user.
     * @param {any} data object that contains the id of the view in control.
     */
    manageUserHologramControl(data){
        this.#log("received manage user hologram control");
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

        eventEmitter.on("createSynchronizedVariable", (data)=>{
            this.#log("create synchronized variable");
            this.#addSynchronizedVariable(data);
        });
    }

    setViewInCharge(data){
        this.viewInCharge = data;
    }

    #setupViewEventHandlers(){
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