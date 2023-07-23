import {CroquetSession} from "../../infrastructure/croquet/croquet_session.js";
import {elementChecker} from "../utility/element_checker.js";
import {synchronizedElementUpdater} from "../utility/synchronized_element_updater.js";
import {coreEventManager} from "../utility/core_event_manager.js";

/**
 * Class used to start or join a session.
 */
class SessionManager {

    /**
     * Constructor of the class.
     */
    constructor(){
        this._sessionStarted = false;
    }

    /**
     * Async method that start a session.
     * @param apiKey {String} the api key.
     * @param appId {String} the app id.
     * @returns {Promise<boolean>}
     */
    async startSession(apiKey, appId){
        if (typeof apiKey === undefined || typeof appId === undefined){
            throw new Error("parameters apiKey and appId can't be undefined!");
        }
        this.#log("apiKey: " + apiKey);
        this.#log("appId: " + appId);

        const croquetSession = new CroquetSession();
        await croquetSession.sessionJoin(apiKey, appId);

        return new Promise((resolve) =>
        {
            this.#log("SessionManager: session started true");
            this._sessionStarted = true;
            resolve(true);
        });
    }

    /**
     * Add a new  synchronized variable to the session
     * @param variable {SynchronizedVariable}
     */
    addSynchronizedVariable(variable){
        if(elementChecker.verifyNameAlreadyExist(name)){
            throw new Error("This name was already used!")
        }

        synchronizedElementUpdater.addSynchronizedVariable(variable);
        coreEventManager.sendEvent("createSynchronizedVariable", JSON.stringify(variable));
    }

    /**
     * Verify if the session is started or not.
     * @returns {boolean} true if the session is started false otherwise
     */
    isSessionStarted(){
        return this._sessionStarted;
    }

    #log(message){
        const debug = false;
        if(debug){
            console.log("SESSION-MANAGER:" + message);
        }
    }
} 

export {SessionManager}