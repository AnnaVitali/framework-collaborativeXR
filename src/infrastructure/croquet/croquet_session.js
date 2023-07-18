import { RootView } from "./view/view.js";
import { RootModel } from "./model/model.js";

/**
 * Class responsible to manage the Croquet session.
 */
class CroquetSession {
    /**
     * Empty constructor of the class.
     */
    constructor(){
        this.debug = true;
    }

    /**
     * Join a specific croquet session.
     * @param apiKey {String} the apikey of the session.
     * @param appId {String} the id of the app related to the session.
     * @returns {*} a promise representing the operation performed
     */
     sessionJoin(apiKey, appId){
        if(this.debug) {
            console.log("Croquet session: session join");
        }

        return Croquet.Session.join({
            apiKey: apiKey,
            appId: appId,
            name: Croquet.App.autoSession(),
            password: Croquet.App.autoPassword(),
            model: RootModel,
            view: RootView,
            autoSleep: false
        });

    }
}

export {CroquetSession}

