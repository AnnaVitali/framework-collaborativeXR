import {eventBus} from "../../event/event_emitter.js";
import {synchronizedElementManager} from "../scene/utility/synchronized_element_manager.js";

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
        this.animationCallback = () =>{
            setTimeout(callback.apply(this), 0);
        }
        eventBus.on(this.name, this.animationCallback);
    }

    /**
     * Start the animation specified.
     */
    startAnimation(){
        if(synchronizedElementManager.update) {
            eventBus.emit("newAnimation", JSON.stringify(this));
        }
    }

    /**
     * Stop the animation specified.
     */
    stopAnimation(){
        if(synchronizedElementManager.update) {
            eventBus.emit("stopAnimation", JSON.stringify(this.name));
        }
    }
}

export {Animation}