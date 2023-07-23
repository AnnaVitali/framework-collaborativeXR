import {elementChecker} from "../utility/element_checker.js";
import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";
import {coreEventManager} from "../utility/core_event_manager.js";

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
        this.isSceneInitialized = false;
    }

    /**
     * Initialize the scene supporting WebXR.
     */
    initializeScene(){
        this.#log("initialize scene");
        this.isSceneInitialized = true;
        coreEventManager.sendEvent("initialize", "");
    }

    /**
     * Add a new importedHologram to the scene.
     * @param hologram {ImportedHologram} the new hologram to add.
     * @returns {Promise<boolean>} representing the insertion made.
     */
    addImportedHologram(hologram){
        this.#log("add imported hologram");
        this.#verifyIfSceneIsInitialized();
        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementUpdater.addHologram(hologram);
        coreEventManager.sendEvent("createImportedHologram", JSON.stringify(hologram));

        return new Promise((resolve) => {
            coreEventManager.listenForInfrastructureEvent("importedHologramCreated" + hologram.name, () => {
                resolve(true)
            });
        });

    }

    /**
     * Add a new StandardHologram to the scene
     * @param hologram {StandardHologram} the new hologram to add.
     * @returns {Promise<boolean>} representing the insertion made.
     */
    addStandardHologram(hologram){
        this.#log("add standard hologram");
        this.#verifyIfSceneIsInitialized();
        this.#verifyIfElementNotExist(hologram.name);
        synchronizedElementUpdater.addHologram(hologram);
        coreEventManager.sendEvent("createStandardHologram", JSON.stringify(hologram));

        return new Promise((resolve) => {
            coreEventManager.listenForInfrastructureEvent("standardHologramCreated" + hologram.name, () => {
                resolve(true)
            });
        });
    }

    /**
     * Add a menu that allows to manipulate a hologram.
     * @param manipulatorMenu {ManipulatorMenu} the menu to add
     */
    addManipulatorMenu(manipulatorMenu){
        this.#log("add manipulator menu");
        this.#verifyIfSceneIsInitialized();
        this.#verifyIfElementExist(manipulatorMenu.hologramName);
        coreEventManager.sendEvent("addManipulatorMenu", JSON.stringify(
            {
                name: manipulatorMenu.hologramName,
                position: manipulatorMenu.position
            }));
    }

    /**
     * Add a nearMenu.
     * @param nearMenu {NearMenu} the menu to add.
     */
    addNearMenu(nearMenu){
        this.#log("add nearMenu");
        this.#verifyIfSceneIsInitialized();
        if(nearMenu.buttonList.length !== 0) {
            coreEventManager.sendEvent("addNearMenu", JSON.stringify(nearMenu));
        }else{
            throw new Error("Can't add a menu without button!");
        }
    }

    /**
     * Activate the render loop for the scene.
     */
    activateRenderLoop(){
        this.#log("activate render loop");
        this.#verifyIfSceneIsInitialized();
        coreEventManager.listenForSynchronizedElementUpdateEvents();
        coreEventManager.sendEvent("render", "");
    }

    #verifyIfSceneIsInitialized(){
        if(!this.isSceneInitialized){
            throw new Error("Scene need to be initialized before adding element or activate render loop!");
        }
    }

    #verifyIfElementNotExist(name){
        if(elementChecker.verifyNameAlreadyExist(name)){
            throw new Error("Element with this name "+ name +" already exist!");
        }
    }

    #verifyIfElementExist(name){
        if(!elementChecker.verifyNameAlreadyExist(name)){
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