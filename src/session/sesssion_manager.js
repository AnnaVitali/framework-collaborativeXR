import {CroquetSession} from "../croquet/croquet_session.js";
class SessionManager {
    constructor(){
        this.debug = true;
        this.sessionStarted = false;
    }

    async startSession(apiKey, appId){
        if (typeof apiKey === undefined || typeof appId === undefined){
            throw new Error("parameters apiKey and appId can't be undefined!");
        }
        if(this.debug) {
            console.log("apiKey: " + apiKey);
            console.log("appId: " + appId);
        }

        const croquetSession = new CroquetSession();
        await croquetSession.sessionJoin(apiKey, appId);

        return new Promise((resolve) =>
        {
            if(this.debug) {
                console.log("SessionManager: session started true");
            }
            this.sessionStarted = true;
            resolve(true);
        });
    }

    isSessionStarted(){
        return this.sessionStarted;
    }
}

export {SessionManager}