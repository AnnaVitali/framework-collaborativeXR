import {eventEmitter} from "../event/event_emitter.js";
import {ElementChecker} from "./element_checker.js";
import {synchronizedElementManager} from "./synchronized_element_manager.js";
class Scene{
    constructor(sessionManager){
        if(!sessionManager.isSessionStarted()){
            throw new Error("Start a session before creating the scene.");
        }
        this.elementChecker = new ElementChecker();
    }

    initializeScene(){
        this.#log("initialize scene");

        eventEmitter.emit("initialize", "");
    }

    addImportedHologramToScene(hologram){
        this.#log("add imported hologram");

        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementManager.addHologram(hologram);
        eventEmitter.emit("importedHologramShow", hologram.name);

        return new Promise((resolve) => {
            eventEmitter.on("importedHologramCreated", () => {
                resolve()
            });
        });

    }

    addStandardHologramToScene(hologram){
        this.#log("add standard hologram");

        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementManager.addHologram(hologram);
        eventEmitter.emit("standardHologramShow", hologram.name);
    }

    addManipulatorMenu(hologramName, manipulatorMenu){
        this.#log("add manipulator menu");

        this.#verifyIfElementExist(hologramName);
        eventEmitter.emit("addManipulatorMenu", JSON.stringify(
            {
                name: hologramName,
                position: manipulatorMenu.position
            }));
    }

    addNearMenu(nearMenu){
        this.#log("add nearMenu");

        if(nearMenu.buttonList.length !== 0) {
            eventEmitter.emit("addNearMenu", JSON.stringify(nearMenu));
        }else{
            throw new Error("Can't add a menu without button!");
        }
    }

    activateRenderLoop(){
        this.#log("activate render loop");

        eventEmitter.emit("render", "");
    }

    #verifyIfElementNotExist(name){
        if(this.elementChecker.verifyNameAlreadyExist(name)){
            throw new Error("Element with this name already exist!");
        }
    }

    #verifyIfElementExist(name){
        if(!this.elementChecker.verifyNameAlreadyExist(name)){
            throw new Error("No element exist with this name!");
        }
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("SCENE: " + message);
        }
    }
}

export {Scene}