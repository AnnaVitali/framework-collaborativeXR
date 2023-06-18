import {eventEmitter} from "../event/event_emitter.js";
import {Pair} from "../utility/pair.js";
import {Triple} from "../utility/triple.js";
class RootView extends Croquet.View {

    /**
     * Constructor for the class.
     * @param {any} model the model of reference
     */
    constructor(model) {
        super(model);
        this.model = model;
        this.hologramsManipulatorMenu = new Map();
        this.hologramViewCopies = new Map();

        console.log("VIEW subscribed ");

        this.#setupBackEndEventHandlers();
        this.#setupModelEventHandlers();
    }

    freezeControlButton(data){
        console.log("VIEW: received freezeControlButton hologram " + data.hologramName);
        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);

        this.#setOtherUserInControlBehaviorControlButton(hologramControls.y);
    }

    restoreControlButton(data){
        console.log("VIEW: recevied restore ControlButton hologram " + data.hologramName);
        const hologramName = data.hologramName;
        const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
        this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
    }

    notifyHologramPositionChanged(hologramName, position, boundingBoxHigh){
        console.log("VIEW: hologram position change");
        if(boundingBoxHigh !== null) {
            this.publish("hologram", "positionChanged",
                {
                    hologramName: hologramName,
                    position_x: position.x,
                    position_y: position.y,
                    position_z: position.z,
                    high: boundingBoxHigh
                });
        }else{
            this.publish("hologram", "positionChanged",
                {
                    hologramName: hologramName,
                    position_x: position.x,
                    position_y: position.y,
                    position_z: position.z
                });
        }
    }

    notifyHologramScaleChanged(hologramName, scale){
        console.log("VIEW: hologram scale change");
        this.publish("hologram", "scaleChanged",
            {
                hologramName: hologramName,
                scale_x: scale.x,
                scale_y: scale.y,
                scale_z: scale.z
            });
    }

    notifyHologramRotationChanged(hologramName, rotation){
        console.log("VIEW: hologram position change");
        this.publish("hologram", "rotationChanged",
            {
                hologramName: hologramName,
                rotation_x: rotation.x,
                rotation_y: rotation.y,
                rotation_z: rotation.z,
                rotation_w: rotation.w
            });
    }

    #setOtherUserInControlBehaviorControlButton(controlButton){
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Red();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.67, 0.29, 0.29);

        controlButton.imageUrl = "../../img/IconClose.png";
        controlButton.onPointerDownObservable.clear();
    }

    #setupModelEventHandlers(){
        this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
        this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
    }

    #notifyUserStartManipulating(hologramName){
        console.log("VIEW: user start manipulating hologram " + hologramName);
        this.publish("controlButton", "clicked", {view: this.viewId, hologramName: hologramName});
    }

    #notifyCurrentUserReleaseControl(hologramName){
        console.log("VIEW: user stop manipulating");
        this.#setDefaultControlButtonBehavior(hologramName, this.hologramsManipulatorMenu.get(hologramName).y);
        this.#removeElementHologramManipulator(hologramName);
        this.publish("controlButton", "released", {view: this.viewId, hologramName: hologramName});
    }

    #removeElementHologramManipulator(hologramName){
        /*const hologramManipulatorElements = this.hologramViewCopies.get(hologramName);

        hologramManipulatorElements.x.dispose();
        hologramManipulatorElements.y.dispose();
        hologramManipulatorElements.z.attachedMesh = null;
        hologramManipulatorElements.z.dispose();*/
    }

    #addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.hologramModel.holograms.get(hologramName)._x.parent;
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.HolographicButton("manipulate", false);//new BABYLON.GUI.TouchHolographicButton();
        manipulatorNearMenu.addButton(controlButton);

        this.#setDefaultControlButtonBehavior(hologramName, controlButton, boundingBoxHigh);
        this.hologramsManipulatorMenu.set(hologramName, new Triple(manipulatorNearMenu, controlButton));
    }

    #setDefaultControlButtonBehavior(hologramName, controlButton, boundingBoxHigh) {
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Blue();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.37, 0.67);
        controlButton.text = "Manipulate";
        controlButton.imageUrl = "../../img/IconAdjust.png";
        controlButton.onPointerDownObservable.clear();


        controlButton.onPointerDownObservable.add(() => {
            this.#addHologramManipulator(hologramName, boundingBoxHigh);
            this.#setManipulatingBehaviourControlButton(hologramName, controlButton);
            this.#notifyUserStartManipulating(hologramName);
        });
    }

    #setManipulatingBehaviourControlButton(hologramName, controlButton){
        controlButton.text = "Stop manipulating";
        controlButton.onPointerDownObservable.clear();
        controlButton.onPointerDownObservable.add(() => {
            this.#notifyCurrentUserReleaseControl(hologramName);
        });
    }

    async #addHologramManipulator(hologramName, boundingBoxHigh){
        const hologramInformation = this.model.hologramModel.holograms.get(hologramName)
        const filePath = hologramInformation._y;
        const scaling = hologramInformation._z._x;
        const euler = hologramInformation._z._y;
        const hologram = hologramInformation._x;
        const {stringSplit, directory} = this.#extractFileAndDirectory(filePath);

        console.log(hologram.position);

        const boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(hologram);
        if(boundingBoxHigh !== null) {
            boundingBox.position = new BABYLON.Vector3(hologram.absolutePosition.x,
                hologram.absolutePosition.y + boundingBoxHigh,
                hologram.absolutePosition.z);
        }
        //boundingBox.scaling.scaleInPlace(2)

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene)
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        const gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), utilLayer)
        gizmo.rotationSphereSize = 0;
        gizmo.scaleBoxSize = 0.03;
        gizmo.attachedMesh = boundingBox;

        var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        sixDofDragBehavior.dragDeltaRatio = 1;
        sixDofDragBehavior.zDragFactor = 1;

        boundingBox.addBehavior(sixDofDragBehavior);

        sixDofDragBehavior.onPositionChangedObservable.add(() => {
            this.notifyHologramPositionChanged(hologramName, boundingBox.absolutePosition, boundingBoxHigh);
        });

        gizmo.onScaleBoxDragObservable.add(() => {
            this.notifyHologramScaleChanged(hologramName, boundingBox.absoluteScaling);
        });

        /*const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(directory, stringSplit[stringSplit.length - 1], this.model.scene);
        try {
            container.addAllToScene();

            container.meshes[0].position = new BABYLON.Vector3(hologram.position.x, hologram.position.y + boundingBoxHigh, hologram.position.z);
            console.log(container.meshes[0].position)
            container.meshes[0].scaling.scaleInPlace(scaling);
            container.meshes[0].rotate(BABYLON.Axis.X, euler.x);
            container.meshes[0].rotate(BABYLON.Axis.Y, euler.y);
            container.meshes[0].rotate(BABYLON.Axis.Z, euler.z);
            container.meshes[0].setEnabled(false);



            const gltfMesh = container.meshes[0]
            const boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh)
            if(boundingBoxHigh !== null) {
                boundingBox.position = new BABYLON.Vector3(hologram.absolutePosition.x,
                    hologram.absolutePosition.y + boundingBoxHigh,
                    hologram.absolutePosition.z);
            }
            //boundingBox.scaling.scaleInPlace(2)

            const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene)
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

            const gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), utilLayer)
            gizmo.rotationSphereSize = 0;
            gizmo.scaleBoxSize = 0.03;
            gizmo.attachedMesh = boundingBox;

            var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
            sixDofDragBehavior.dragDeltaRatio = 1;
            sixDofDragBehavior.zDragFactor = 1;

            boundingBox.addBehavior(sixDofDragBehavior);

            sixDofDragBehavior.onPositionChangedObservable.add(() => {
                this.notifyHologramPositionChanged(hologramName, boundingBox.absolutePosition, boundingBoxHigh);
            });

            gizmo.onScaleBoxDragObservable.add(() => {
                this.notifyHologramScaleChanged(hologramName, boundingBox.absoluteScaling);
            });
        }catch(error){
            throw new Error(error);
        }*/
    }

    #extractFileAndDirectory(filePath) {
        const stringSplit = filePath.split("/");
        let directory = "";
        for (let i = 0; i < (stringSplit.length - 1); i++){
            directory += stringSplit[i] + "/";
        }

        return {stringSplit, directory};
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("addManipulatorMenu", (data) => {
            console.log("VIEW: received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;
            let boundingBoxHigh = null;

            if(typeof object.boundingBoxHigh !== undefined){
                boundingBoxHigh = object.boundingBoxHigh;
            }

            console.log("name ");
            console.log(hologramName);
            console.log("position ")
            console.log(menuPosition);

            this.#addManipulatorMenu(hologramName, menuPosition, boundingBoxHigh);
        })
    }
}



export { RootView };