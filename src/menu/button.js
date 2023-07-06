import {eventEmitter} from "../event/event_emitter.js";

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
            setTimeout(onPointerDownCallback.apply(this), 0)
        });
    }
}

export {Button}