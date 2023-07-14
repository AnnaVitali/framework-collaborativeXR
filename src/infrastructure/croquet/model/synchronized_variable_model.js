import {CroquetSynchronizedVariable} from "../animation/croquet_synchronized_variable.js";
import {eventBus} from "../../../eventBus/event_bus.js";

/**
 * Class that represents a model for the synchronized variable.
 */
class SynchronizedVariableModel extends Croquet.Model{
    /**
     * Initialize the model
     * @param options {Object} containing the creation options.
     */
    init(options = {}){
        super.init();
        this.syncrhonizedVariables = new Map();
    }

    /**
     * Add a new variable
     * @param variable {CroquetSynchronizedVariable} the variable to add.
     */
    addVariable(variable){
        if(!this.syncrhonizedVariables.has(variable.name)){
            this.syncrhonizedVariables.set(variable.name, variable);
        }else{
            throw new Error("Synchronized variable with this name already present!");
        }
    }

    /**
     * Update the value associated to the variable.
     * @param variableName {String} the name of the variable.
     * @param value the value assigned to the variable.
     */
    updateValue(variableName, value){
        this.syncrhonizedVariables.get(variableName).value = value;
        eventBus.emit("updateValue", JSON.stringify({variableName: variableName, value: value}));
    }

    static types() {
        return {
            "CroquetSynchronizedVariable": CroquetSynchronizedVariable,
        };
    }
}

SynchronizedVariableModel.register("SynchronizedVariableModel");

export {SynchronizedVariableModel}