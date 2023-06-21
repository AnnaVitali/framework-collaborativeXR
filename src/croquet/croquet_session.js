import { RootView } from "./view.js";
import { RootModel } from "./model.js";

class CroquetSession {
    constructor(){
        this.debug = true;
    }

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

