import {HologramModel} from "./submodel/hologram_model.js";
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
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);

        if(viewId === this.viewInCharge){
            this.viewInCharge = this.linkedViews[0];
            console.log(this.viewInCharge)
            this.publish(this.viewInCharge, "setUpdate");
        }
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
            "Map": Map,
        };
    }

}


RootModel.register("RootModel");


export {RootModel};