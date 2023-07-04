import {eventEmitter} from "../event/event_emitter.js";
class Scene{
    constructor(sessionManager){
        if(!sessionManager.isSessionStarted()){
            throw new Error("Start a session before creating the scene.");
        }
        this.debug = true;
    }

    initializeScene(){
        if(this.debug){
            console.log("Scene: initialize scene");
        }
        eventEmitter.emit("initialize", "");
    }

    addImportedHologramToScene(hologramName){
        if(this.debug){
            console.log("Scene: add imported hologram");
        }

        eventEmitter.emit("importedHologramShow", hologramName);

        return new Promise((resolve) => {
            eventEmitter.on("importedHologramCreated", () => {
                resolve()
            });
        })
    }

    addStandardHologramToScene(hologramName){
        if(this.debug){
            console.log("Scene: add standard hologram");
        }

        eventEmitter.emit("standardHologramShow", hologramName);
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