import {HologramModel} from "./submodel/hologram_model.js";
import {StandardHologramClone} from "../../hologram/standard_hologram_clone.js";
import {ImportedHologramClone} from "../../hologram/imported_hologram_clone.js";
import {SynchronizedVariableClone} from "../../synchronizedVariable/synchronized_variable_clone.js";
import {Vector3} from "../../../utility/vector3.js";
import {SynchronizedVariableModel} from "./submodel/synchronized_variable_model.js";
import {AnimationModel} from "./submodel/animation_model.js";

/**
 * Class representing the root model of the application.
 */
class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        this.animationModels = new Map();
        this.hologramInUserControl = new Map();
        this.hologramModel = HologramModel.create();
        this.synchronizedVariableModel = SynchronizedVariableModel.create();

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
        console.log(this.linkedViews);
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
        if(viewId === this.viewInCharge){
            this.viewInCharge = this.linkedViews[0];
            console.log(this.viewInCharge)
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
     * Require to update the position of the hologram due to manipulation.
     * @param data {Object} object containing the data of the hologram.
     */
    requireUpdateHologramPosition(data){
        this.#log("received requireHologramUpdate");
        const hologramName = data.hologramName;
        const position = new Vector3(data.position_x, data.position_y, data.position_z);

        this.hologramModel.updateHologramPositionManipulation(hologramName, position);
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedPosition", hologramName);
        });
    }

    /**
     * Require to update the rotation of the hologram due to manipulation.
     * @param data {Object} object containing the data of the hologram.
     */
    requireUpdateHologramScaling(data){
        this.#log("received requireHologramUpdate");
        const hologramName = data.hologramName;
        const scale = new Vector3(data.scale_x, data.scale_y, data.scale_z);

        this.hologramModel.updateHologramScalingManipulation(hologramName, scale);
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "showHologramUpdatedScale", hologramName);
        });
    }

    /**
     * Require to show user manipulation.
     * @param data {Object} object containing the data of the hologram and the view.
     */
    requireShowUserManipulation(data){
        this.#log("received showUserManipulation");
        this.#log(data.view);

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
     * Create a new animation model.
     * @param data {Object} object containing the information about the animation.
     */
    createNewAnimation(data){
        this.#log("received create new Animation");
        const animationName = data._name;
        const animationTime = data._time;

        if(!this.animationModels.has(animationName)){
            this.animationModels.set(animationName, AnimationModel.create({name: animationName, time: animationTime}));
        }
    }

    /**
     * Destroy the animation associated to a specific animation model.
     * @param animationName {String} the name of the animation
     */
    destroyAnimation(animationName){
        this.#log("received stop animation");
        if(this.animationModels.has(animationName)){
            this.animationModels.get(animationName).destroy();
            this.animationModels.delete(animationName);
        }
    }

    /**
     * Set the view in charge of sending the update.
     * @param viewId the view id.
     */
    setViewInCharge(viewId){
        this.viewInCharge = viewId;
    }

    #setupViewEventHandlers(){
        this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
        this.subscribe("hologramManipulation", "positionChanged", this.requireUpdateHologramPosition);
        this.subscribe("hologramManipulation", "scaleChanged", this.requireUpdateHologramScaling);

        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
        this.subscribe("controlButton", "clicked", this.manageUserHologramControlRequired);

        this.subscribe("animation", "createAnimation", this.createNewAnimation);
        this.subscribe("animation", "stopAnimation", this.destroyAnimation);

        this.subscribe("view", "viewInCharge", this.setViewInCharge);
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