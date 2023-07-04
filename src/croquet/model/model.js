import {eventEmitter} from "../../event/event_emitter.js";
import {HologramModel} from "./hologram_model.js";
import {ImportedHologramModel} from "../imported_hologram_model.js";
import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";

const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        this.children = new Map();
        this.hologramModel = HologramModel.create();

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupBackEndEventHandlers();
        this.#setupViewEventHandlers();
    }

    #createImportedHologramModel(data){
        this.#log("crateImportedHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetImportedHologram.prototype, Object.getOwnPropertyDescriptors(object));
        const child = ImportedHologramModel.create({hologram: hologram});

        this.children.set(hologramName, child);
        //child.setScene(this.scene);
        /*console.log(this.scene);
        const object = JSON.parse(data);
        const hologramObject = object.hologram;
        const hologramName = hologramObject._name;
        if(!this.children.has(hologramName)) {
            this.children.set(hologramName, child);
            child.createNewImportedHologramInstance(hologramObject);
        }*/
    }

    #createStandardHologramModel(data){
        this.#log("crateStandardHologram received");
        const object = JSON.parse(data);
        const hologram = Object.create(CroquetStandardHologram.prototype, Object.getOwnPropertyDescriptors(object));

        this.hologramModel.addHologram(hologram);
       /* child.setScene(this.scene);
        const object = JSON.parse(data);
        const hologramObject = object.hologram;
        const hologramName = hologramObject._name;
        if(!this.children.has(hologramName)) {
            this.children.set(hologramName, child);
            child.createNewStandardHologramInstance(hologramObject);
        }*/
    }

    updateHologramColor(data){
        this.#log("update hologram color received");

        const object = JSON.parse(data);
        const hologramName = object.hologramName;
        const color = object.color;

        this.hologramModel.changeColorHologram(hologramName, color);
    }

    requireHologramUpdate(data){
        this.#log("received requireHologramUpdate");

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdates", data);
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
            this.#createImportedHologramModel(data);
        });

        eventEmitter.on("standardHologramCreate", (data) => {
            this.#log("createStandardHologramModel");
            this.#createStandardHologramModel(data);
        } );
    }

    #setupViewEventHandlers(){
        this.subscribe("updateHologram", "changeColor", this.updateHologramColor)
        /*this.subscribe("controlButton", "clicked", this.manageUserHologramControl);
        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
        this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
        this.subscribe("updateHologram", "showChanges", this.requireHologramUpdate);*/
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