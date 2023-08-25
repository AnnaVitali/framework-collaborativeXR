import {infrastructureEventManager} from "../../utility/infrastructure_event_manager.js";
import {StandardObject} from "../../../core/standardObject/standard_object.js";

/**
 * Class that represents a model for the standard object.
 */
class StandardObjectModel extends Croquet.Model{
    /**
     * Initialize the model
     * @param options {Object} containing the creation options.
     */
    init(options = {}){
        super.init();
        this.syncrhonizedVariables = new Map();

        this.#setupViewEventHandlers();
    }

    /**
     * Add a standardObject.
     * @param data {Object} object containing the data of the object.
     */
    addObject(data){
        const variable = Object.create(StandardObject.prototype, Object.getOwnPropertyDescriptors(data));
        if(!this.syncrhonizedVariables.has(variable.name)) {
            this.syncrhonizedVariables.set(variable.name, variable);
        }else{
            const value = this.syncrhonizedVariables.get(variable.name).value;
            infrastructureEventManager.sendEvent("updateValue", JSON.stringify({variableName: variable.name, value: value}));
        }
    }

    /**
     * Update the value of a synchronized variable.
     * @param data {Object} object containing the data of the object.
     */
    updateValue(data){
        const variableName = data.variableName;
        const value = data.value;

        if(this.syncrhonizedVariables.get(variableName).value !== value) {
            this.syncrhonizedVariables.get(variableName).changeValueWithoutSync(value);
            infrastructureEventManager.sendEvent("updateValue", JSON.stringify({
                variableName: variableName,
                value: value
            }));
        }
    }

    #setupViewEventHandlers(){
        this.subscribe("create", "synchronizedVariable", this.addObject);
        this.subscribe("synchronizedVariable", "valueChange", this.updateValue)
    }

    static types() {
        return {
            "StandardObject": StandardObject,
        };
    }
} 

StandardObjectModel.register("SynchronizedVariableModel");

export {StandardObjectModel}