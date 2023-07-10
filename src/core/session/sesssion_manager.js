import {CroquetSession} from "../../infrastructure/croquet/croquet_session.js";

/**
 * Class used to start or join a session.
 */
class SessionManager {

    /**
     * Constructor of the class.
     */
    constructor(){
        this.debug = true;
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
     * Verify if the session is started or not.
     * @returns {boolean} true if the session is started false otherwise
     */
    isSessionStarted(){
        return this._sessionStarted;
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log(message);
        }
    }
}

export {SessionManager}