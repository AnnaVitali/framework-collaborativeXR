import {CroquetSession} from "../croquet/croquet_session.js";
class SessionManager {
    constructor(){
        this.debug = true;
    }

    async startSession(apiKey, appId){
        if (typeof apiKey === undefined || typeof appId === undefined){
            throw new Error("parameters apiKey and appId can't be undefined!");
        }
        if(this.debug) {
            console.log("SessionManager: session started");
            console.log("apiKey: " + apiKey);
            console.log("appId: " + appId);
        }

        const croquetSession = new CroquetSession();
        await croquetSession.sessionJoin(apiKey, appId);

        return new Promise((resolve) => resolve(true));
    }
}

export {SessionManager}