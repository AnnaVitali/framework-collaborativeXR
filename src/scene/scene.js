import {eventEmitter} from "../event/event_emitter.js";
class Scene{
    constructor(sessionManager){
        if(!sessionManager.isSessionStarted()){
            throw new Error("Start a session before creating the scene.");
        }
        this.hologramManager = new HologramManager();
        this.debug = true;
    }

    initializeScene(){
        if(this.debug){
            console.log("Scene: initialize scene");
        }
        eventEmitter.emit("initialize", "");
    }

    addImportedHologramToScene(hologram){
        if(this.debug){
            console.log("Scene: add imported hologram");
        }
        eventEmitter.emit("importedHologramShow", hologram.name);

        return new Promise((resolve) => {
            eventEmitter.on("importedHologramCreated", () => {
                resolve()
            });
        })
    }

    addStandardHologramToScene(hologram){
        if(this.debug){
            console.log("Scene: add standard hologram");
        }

        eventEmitter.emit("standardHologramShow", hologram.name);
    }

    addManipulatorMenu(hologramName, menuPosition){
        if(this.debug){
            console.log("Scene: add manipulator menu");
        }

        eventEmitter.emit("addManipulatorMenu", JSON.stringify(
            {
                name: hologramName,
                position: menuPosition
            }));
    }

    activateRenderLoop(){
        if(this.debug){
            console.log("Scene: activate render loop");
        }
        eventEmitter.emit("render", "");
    }
}

export {Scene}