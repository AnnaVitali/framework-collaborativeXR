import {eventBus} from "../../event/event_emitter.js";

/**
 * Class representing an animation that can be associated with an element.
 */
class Animation{
    /**
     * Constructor of the class
     * @param name {String} the animation name.
     * @param time {Number} the time scheduling of the animation in ms.
     */
    constructor(name, time){
        this._name = name;
        this._time = time;

        eventBus.emit("newAnimation", JSON.stringify(this));
    }

    /**
     * Get the name of the animation.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the time of the animation.
     * @returns {Number}
     */
    get time() {
        return this._time;
    }

    /**
     * Set the callback to call when the time expired.
     * @param callback the callback to apply.
     */
    setAnimationCallback(callback){
        eventBus.on(this.name, () =>{
            setTimeout(callback.apply(this), 0);
        })
    }
}

export {Animation}