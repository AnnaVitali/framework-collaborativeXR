import {eventEmitter} from "../event/event_emitter.js";
class Scene{
    constructor(sessionManager){
        if(!sessionManager.isSessionStarted()){
            throw new Error("Start a session before creating the scene.");
        }
    }

    initializeScene(){
        this.#log("initialize scene");

        eventEmitter.emit("initialize", "");
    }

    addImportedHologramToScene(hologram){
        this.#log("add imported hologram");

        eventEmitter.emit("importedHologramShow", hologram.name);

        return new Promise((resolve) => {
            eventEmitter.on("importedHologramCreated", () => {
                resolve()
            });
        })
    }

    addStandardHologramToScene(hologram){
        this.#log("add standard hologram");

        eventEmitter.emit("standardHologramShow", hologram.name);
    }

    addManipulatorMenu(hologramName, manipulatorMenu){
        this.#log("add manipulator menu");

        eventEmitter.emit("addManipulatorMenu", JSON.stringify(
            {
                name: hologramName,
                position: manipulatorMenu.position
            }));
    }

    addNearMenu(nearMenu){
        this.#log("add nearMenu");

        eventEmitter.emit("addNearMenu", JSON.stringify(nearMenu));
    }

    activateRenderLoop(){
        this.#log("activate render loop");

        eventEmitter.emit("render", "");
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("SCENE: " + message);
        }
    }
}

export {Scene}