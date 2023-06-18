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

    addHologramToScene(hologramName, hologram){
        if(this.debug){
            console.log("Scene: add hologram");
        }

        eventEmitter.emit("hologramCreate", JSON.stringify({name: hologramName, hologram: hologram}));

        return new Promise((resolve) => {
            eventEmitter.on("hologramCreated", () => {
                resolve()
            });
        })
    }

    addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh){
        if(this.debug){
            console.log("Scene: add manipulator menu");
        }

        if(typeof boundingBoxHigh !== undefined){
            eventEmitter.emit("addManipulatorMenu", JSON.stringify(
                {
                name: hologramName,
                position: menuPosition,
                boundingBoxHigh: boundingBoxHigh
                }
            ));
        }else {
            eventEmitter.emit("addManipulatorMenu", JSON.stringify(
                {
                    name: hologramName,
                    position: menuPosition
                }
            ));
        }
    }

    activateRenderLoop(){
        if(this.debug){
            console.log("Scene: activate render loop");
        }
        eventEmitter.emit("render", "");
    }
}

export {Scene}