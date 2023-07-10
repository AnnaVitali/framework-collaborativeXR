import {eventBus} from "../../../event/event_emitter.js";

/**
 * Class that represents a View in charge of handling a specific animation.
 */
class AnimationView extends Croquet.View{

    /**
     * Constructor of the class.
     * @param model {Croquet.Model} the Croquet model of reference.
     * @param name {String} the name of the animation.
     * @param time {Number} the scheduling time for the animation.
     */
    constructor(model, name, time) {
        super(model);
        this.name = name;
        this.time = time;

        this.future(this.time).tick();
    }

    /**
     * Method to call when the time expired.
     */
    tick(){
        this.#log("model emit" + this.name);
        eventBus.emit(this.name, "");
        this.future(this.time).tick();
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("A-MODEL: " + message);
        }
    }
}

export {AnimationView}