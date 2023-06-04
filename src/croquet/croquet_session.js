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
            apiKey: '1Ms8POLqF7FJlrcmGNj4xx401r3E22bJs4LpMu4bH',
            appId: 'it.unibo.studio.anna_2evitali4.collaborativeXR',
            name: "unnamed",
            password: "secret",
            model: RootModel,
            view: RootView
        });

    }
}

export {CroquetSession}

