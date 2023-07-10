import {HologramRenderer} from "./hologram_renderer.js";
import {eventEmitter} from "../event/event_emitter.js";
import {CroquetStandardHologram} from "../croquet/hologram/croquet_standard_hologram.js";

class SceneManager{

    constructor() {
        this.hologramRenders = new Map();
    }
    initializeScene(){
        const canvas = document.getElementById("renderCanvas");
        this.#log("initialize scene called");
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3.Black;

        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.3, -0.3), this.scene);
        camera.minZ = 0.01;
        camera.attachControl(canvas, true);
        camera.inputs.addMouseWheel();


        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1;


        this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
        this.GUIManager.useRealisticScaling = true;
    }

    async #createWebXRExperience() {
        const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar')
        let xrHelper

        if (supported) {
            this.#log("IMMERSIVE AR SUPPORTED");
            xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-ar',
                    referenceSpaceType: "local-floor"
                }
            });
        } else {
            this.#log("IMMERSIVE VR SUPPORTED")
            xrHelper = await this.scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: 'immersive-vr',
                }
            });
        }

        try {
            xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", { xrInput: xr.input });
        } catch (err) {
            this.#log("Articulated hand tracking not supported in this device.");
        }

        return this.scene;
    }

    activateRenderLoop() {
        this.#log("activate render loop called");
        this.#createWebXRExperience().then(sceneToRender => {
            this.engine.runRenderLoop(() => sceneToRender.render());
        });
    }

    addStandardHologram(hologram){
        this.#log("addStandardHologram");
        const hologramRender = new HologramRenderer(this.scene);
        hologramRender.renderStandardHologram(hologram);
        this.hologramRenders.set(hologram.name, hologramRender);
    }

    addImportedHologram(hologram){
        this.#log("addImportedHologram");
        const hologramRender = new HologramRenderer(this.scene);
        hologramRender.renderImportedHologram(hologram);
        this.hologramRenders.set(hologram.name, hologramRender);
    }

    addNearMenu(menuPosition, menuRows, buttonList){
        const nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        let holographicButtonList = [];
        nearMenu.rows = menuRows;
        this.GUIManager.addControl(nearMenu);
        nearMenu.isPinned = true;
        nearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        buttonList.forEach(b => {
            const button = new BABYLON.GUI.TouchHolographicButton();
            button.name = b._name;
            button.text = b._text;
            holographicButtonList.push(button);
            nearMenu.addButton(button);
        });

        return holographicButtonList
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("SCENE MANAGER: " + message);
        }
    }
}

export {SceneManager}