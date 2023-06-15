import {eventEmitter} from "../event/event_emitter.js";
import {HologramModel} from "./hologram_model.js";

const canvas = document.getElementById("renderCanvas");

class RootModel extends Croquet.Model {

    /**
     * Initialize the Model.
     * */
    init() {
        this.linkedViews = [];
        this.hologramModel = HologramModel.create();
        this.isUserManipulating = false;
        this.viewInControl = null;

        this.subscribe(this.sessionId, "view-join", this.viewJoin);
        this.subscribe(this.sessionId, "view-exit", this.viewDrop);

        this.#setupBackEndEventHandlers();
        this.#setupViewEventHandlers();
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("initialize", (data) => {
            this.initializeScene();
        });

        eventEmitter.on("render", (data) => {
            this.activateRenderLoop();
        });

        eventEmitter.on("hologramCreate", (hologram) => {
            console.log("MODEL: create hologram");
            //this.publish(this.id, "hologramCreate", hologram);
            this.#createHologramModel(hologram);
        } )
    }

    #setupViewEventHandlers(){
        this.subscribe("controlButton", "clicked", this.manageUserHologramControl);
        this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
    }

    /**
     * Handle a new connected view.
     * @param {any} viewId the id of the new view connected.
     */
    viewJoin(viewId){
        console.log("MODEL: received view join");
        this.linkedViews.push(viewId);
    }

    /**
     * Handle the view left event.
     * @param {any} viewId the id of the outgoing view.
     */
    viewDrop(viewId){
        console.log("MODEL: received view left");
        this.linkedViews.splice(this.linkedViews.indexOf(viewId),1);
        if(this.linkedViews.length === 0){
            this.destroy();
        }
    }

    /**
     * Manage the control of the hologram from the user.
     * @param {any} data object that contains the id of the view in control.
     */
    manageUserHologramControl(data){
        console.log("MODEL: received manage user hologram control");
        console.log("data:");
        console.log(data);
        this.isUserManipulating = true;
        this.viewInControl = data.view;

        console.log(this.linkedViews)
        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "freezeControlButton", {hologramName: data.hologramName});
            console.log("v:" + v);
        });
    }

    /**
     * Manage the relase of the control from the user who had it.
     * @param {any} data object that contains the id of the view where the user released the control.
     */
    manageUserHologramControlReleased(data){
        console.log("MODEL: received manage user hologram control released");
        this.isUserManipulating = false;

        this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "restoreControlButton", {hologramName: data.hologramName});
        });
    }

    initializeScene(){
        console.log("MODEL: initialize scene called");
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;

        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.3, -0.3), this.scene);
        camera.minZ = 0.01;
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;


        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;
        this.hologramModel.setScene(this.scene);
    }

    async #createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')
        let xrHelper

        if (supported) {
            console.log("IMMERSIVE AR SUPPORTED");
            xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            console.log("IMMERSIVE VR SUPPORTED")
            xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-vr',
                }
            });
        }

        try {
            xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: xr.input });
        } catch (err) {
            console.log("Articulated hand tracking not supported in this browser.");
        }

        return this.scene;
    }

    activateRenderLoop() {
        console.log("MODEL: activate render loop called");
        this.#createWebXRExperience().then(sceneToRender => {
            this.engine.runRenderLoop(() => sceneToRender.render());
        });
    }

    #createHologramModel(hologram){
        this.hologramModel.createNewHologramInstance(hologram);
    }

}


RootModel.register("RootModel");


export {RootModel};