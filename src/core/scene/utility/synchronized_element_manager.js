import {eventBus} from "../../../event/event_emitter.js";

/**
 * Utility class, used to made element consistent.
 */
class SynchronizedElementManager{

    /**
     * Empty constructor of the class.
     */
    constructor(){
        this._update = false;
        this.renderLoopStarted = false;
        this.holograms = new Map();
        this.synchronizedVariables = new Map();

        this.#setupEventHandlers()
    }

    /**
     * Set the render loop as started or not.
     * @param value {boolean} the value to assign.
     */
    setRenderLoopStarted(value){
        this.renderLoopStarted = value;
    }

    /**
     * Get value of the variable update.
     * @returns {boolean}
     */
    get update() {
        return this._update;
    }

    /**
     * Set if this user has to manage the update or not.
     * @param value
     */
    set update(value) {
        this._update = value;
    }

    /**
     * Add a hologram to the synchronized element.
     * @param hologram {Hologram} the hologram to add.
     */
    addHologram(hologram){
        this.holograms.set(hologram.name, hologram);
    }

    /**
     * Add a synchronized variable to the synchronized element.
     * @param variable {SynchronizedVariable} the variable to add
     */
    addSynchronizedVariable(variable){
        this.synchronizedVariables.set(variable.name, variable);
    }

    #setupEventHandlers(){
        eventBus.on("setUpdate", ()=> this.update = true);

        eventBus.on("updateValue", (data) =>{
            if(this.renderLoopStarted) {
                const object = JSON.parse(data);
                const variableName = object.variableName;

                this.synchronizedVariables.get(variableName)._value = object.value;
            }
        });

        eventBus.on("updatePosition", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.#extractObjectAndName(data);
                this.holograms.get(hologramName)._position = object.position;
            }
        });

        eventBus.on("updateRotation", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.#extractObjectAndName(data);
                this.holograms.get(hologramName)._rotation = object.rotation;
            }
        });

        eventBus.on("updateScaling", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.#extractObjectAndName(data);
                this.holograms.get(hologramName)._scaling = object.scaling;
            }
        });

        eventBus.on("updateColor", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.#extractObjectAndName(data);
                this.holograms.get(hologramName)._color = object.color;
            }
        });

    }

    #extractObjectAndName(data) {
        const object = JSON.parse(data);
        const hologramName = object.hologramName;

        return {object, hologramName}
    }
}

const synchronizedElementManager = new SynchronizedElementManager();

export {synchronizedElementManager}