import {eventEmitter} from "../../event/event_emitter.js";

class AnimationView extends Croquet.View{

    constructor(model, name, time) {
        super(model);
        this.name = name;
        this.time = time;

        this.future(this.time).tick();
    }

    tick(){
        this.#log("model emit" + this.name);
        eventEmitter.emit(this.name, "");
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