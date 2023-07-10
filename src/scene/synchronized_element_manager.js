import {eventEmitter} from "../event/event_emitter.js";

class SynchronizedElementManager{

    constructor(){
        this._update = false;
        this._renderLoopStarted = false;
        this.holograms = new Map();
        this.synchronizedVariables = new Map();

        this.#setupEventHandlers()
    }

    get renderLoopStarted(){
        return this._renderLoopStarted;
    }

    set renderLoopStarted(value){
        this._renderLoopStarted = value;
    }

    get update() {
        return this._update;
    }

    set update(value) {
        this._update = value;
    }

    addHologram(hologram){
        this.holograms.set(hologram.name, hologram);
    }

    addSynchronizedVariable(variable){
        this.synchronizedVariables.set(variable.name, variable);
    }

    #setupEventHandlers(){
        eventEmitter.on("setUpdate", ()=> this.update = true);

        eventEmitter.on("updateValue", (data) =>{
            if(this.renderLoopStarted) {
                const object = JSON.parse(data);
                const variableName = object.variableName;

                this.synchronizedVariables.get(variableName)._value = object.value;
            }
        });

        eventEmitter.on("updatePosition", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.extractObjectAndName(data);
                console.log(this.holograms);
                this.holograms.get(hologramName)._position = object.position;
            }
        });

        eventEmitter.on("updateRotation", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.extractObjectAndName(data);
                this.holograms.get(hologramName)._rotation = object.rotation;
            }
        });

        eventEmitter.on("updateScaling", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.extractObjectAndName(data);
                this.holograms.get(hologramName)._scaling = object.scaling;
            }
        });

        eventEmitter.on("updateColor", (data) =>{
            if(this.renderLoopStarted) {
                const {object, hologramName} = this.extractObjectAndName(data);
                this.holograms.get(hologramName)._color = object.color;
            }
        });

    }

    extractObjectAndName(data) {
        const object = JSON.parse(data);
        const hologramName = object.hologramName;

        return {object, hologramName}
    }
}

const synchronizedElementManager = new SynchronizedElementManager();

export {synchronizedElementManager}