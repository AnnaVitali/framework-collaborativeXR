import {eventBus} from "../../event/event_emitter.js";
import {ElementChecker} from "./utility/element_checker.js";
import {synchronizedElementManager} from "./utility/synchronized_element_manager.js";

/**
 * Class that represents the XR scene in which the element are visible.
 */
class Scene{
    /**
     * Constructor of the class.
     * @param sessionManager {SessionManager} representing the current session.
     */
    constructor(sessionManager){
        if(!sessionManager.isSessionStarted()){
            throw new Error("Start a session before creating the scene.");
        }
        this.elementChecker = new ElementChecker();
    }

    /**
     * Initialize the scene supporting WebXR.
     */
    initializeScene(){
        this.#log("initialize scene");

        eventBus.emit("initialize", "");
    }

    /**
     * Add a new importedHologram to the scene.
     * @param hologram {ImportedHologram} the new hologram to add.
     * @returns {Promise<boolean>} representing the insertion made.
     */
    addImportedHologramToScene(hologram){
        this.#log("add imported hologram");

        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementManager.addHologram(hologram);
        eventBus.emit("createImportedHologram", JSON.stringify(hologram));

        return new Promise((resolve) => {
            eventBus.on("importedHologramCreated", () => {
                resolve(true)
            });
        });

    }

    /**
     * Add a new StandardHologram to the scene
     * @param hologram {StandardHologram} the new hologram to add.
     * @returns {Promise<boolean>} representing the insertion made.
     */
    addStandardHologramToScene(hologram){
        this.#log("add standard hologram");

        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementManager.addHologram(hologram);
        eventBus.emit("createStandardHologram", JSON.stringify(hologram));

        return new Promise((resolve) => {
            eventBus.on("standardHologramCreated", () => {
                resolve(true)
            });
        });
    }

    /**
     * Add a menu that allows to manipulate a hologram.
     * @param hologramName {String} the name of the hologram.
     * @param manipulatorMenu {ManipulatorMenu} the menu to add
     */
    addManipulatorMenu(hologramName, manipulatorMenu){
        this.#log("add manipulator menu");

        this.#verifyIfElementExist(hologramName);
        eventBus.emit("addManipulatorMenu", JSON.stringify(
            {
                name: hologramName,
                position: manipulatorMenu.position
            }));
    }

    /**
     * Add a nearMenu.
     * @param nearMenu {nearMenu} the menu to add.
     */
    addNearMenu(nearMenu){
        this.#log("add nearMenu");

        if(nearMenu.buttonList.length !== 0) {
            eventBus.emit("addNearMenu", JSON.stringify(nearMenu));
        }else{
            throw new Error("Can't add a menu without button!");
        }
    }

    /**
     * Activate the render loop for the scene.
     */
    activateRenderLoop(){
        this.#log("activate render loop");
        synchronizedElementManager.setRenderLoopStarted(true);
        eventBus.emit("render", "");
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