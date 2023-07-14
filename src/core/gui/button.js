import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";
import {coreEventManager} from "../utility/core_event_manager.js";

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
     * @param callback the callback to apply.
     */
    setOnPointerDownCallback(callback){
        coreEventManager.listenForInfrastructureEvent(this.name, () => {
            if(!synchronizedElementUpdater.update) {
                synchronizedElementUpdater.update = true;
                setTimeout(callback.apply(this), 0);
                synchronizedElementUpdater.update = false;
            }else{
                setTimeout(callback.apply(this), 0);
            }
        });
    }
}

export {Button}