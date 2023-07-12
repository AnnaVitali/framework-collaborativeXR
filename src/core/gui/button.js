import {eventBus} from "../../event/event_emitter.js";
import {synchronizedElementManager} from "../utility/synchronized_element_manager.js";

/**
 * Class representing a Button that can be added to a menu.
 */
class Button {
    /**
     * Constructor of the class.
     * @param name {String} the name of the button.
     * @param text {String} the text to display.
     */
    constructor(name, text){
        this._text = text;
        this._name = name;
    }

    /**
     * Get the name of the button.
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Get the text of the button.
     * @returns {String}
     */
    get text() {
        return this._text;
    }

    /**
     * Set the text of the button.
     * @param value
     */
    set text(value) {
        this._text = value;
    }

    /**
     * Set the callback to call when the button is clicked.
     * @param onPointerDownCallback the callback to apply.
     */
    setOnPointerDownCallback(onPointerDownCallback){
        eventBus.on(this.name, () => {
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