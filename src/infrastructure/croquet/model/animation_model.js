import {eventBus} from "../../../event/event_emitter.js";

/**
 * Class that represents a View in charge of handling a specific animation.
 */
class AnimationModel extends Croquet.Model{


    init(options = {}) {
        super.init();
        this.name = options.name;
        this.time = options.time;

        this.future(this.time).tick();
    }

    /**
     * Method to call when the time expired.
     */
    tick(){
        this.#log("model emit" + this.name);
        this.publish("view", "animationTick", this.name);
        this.future(this.time).tick();
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("A-MODEL: " + message);
        }
    }
}

AnimationModel.register("AnimationModel");

export {AnimationModel}