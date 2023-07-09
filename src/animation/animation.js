import {eventEmitter} from "../event/event_emitter.js";

class Animation{
    constructor(name, time){
        this._name = name;
        this._time = time;

        eventEmitter.emit("newAnimation", JSON.stringify(this));
    }
    get name() {
        return this._name;
    }


    get time() {
        return this._time;
    }

    setAnimationCallback(callback){
        eventEmitter.on(this.name, () =>{
            setTimeout(callback.apply(this), 0);
        })
    }
}

export {Animation}