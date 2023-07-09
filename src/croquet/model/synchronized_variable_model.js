import {CroquetSynchronizedVariable} from "../animation/croquet_synchronized_variable.js";
import {eventEmitter} from "../../event/event_emitter.js";

class SynchronizedVariableModel extends Croquet.Model{
    init(options = {}){
        super.init();
        this.syncrhonizedVariables = new Map();
    }

    addVariable(variable){
        if(!this.syncrhonizedVariables.has(variable.name)){
            this.syncrhonizedVariables.set(variable.name, variable);
        }else{
            throw new Error("Synchronized variable with this name already present!");
        }
    }

    updateValue(variableName, value){
        this.syncrhonizedVariables.get(variableName).value = value;
        eventEmitter.emit("updateValue", JSON.stringify({variableName: variableName, value: value}));
    }

    static types() {
        return {
            "CroquetSynchronizedVariable": CroquetSynchronizedVariable,
        };
    }
}

SynchronizedVariableModel.register("SynchronizedVariableModel");

export {SynchronizedVariableModel}