import {eventEmitter} from "../event/event_emitter.js";
import {synchronizedElementManager} from "../scene/synchronized_element_manager.js";

class Button {
    get name() {
        return this._name;
    }
    constructor(name, text){
        this._text = text;
        this._name = name;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    setOnPointerDownCallback(onPointerDownCallback){
        eventEmitter.on(this.name, () => {
            if(!synchronizedElementManager.update) {
                synchronizedElementManager.update = true;
                setTimeout(onPointerDownCallback.apply(this), 0);
                synchronizedElementManager.update = false;
            }else{
                setTimeout(onPointerDownCallback.apply(this), 0);
            }
        });
    }
}

export {Button}