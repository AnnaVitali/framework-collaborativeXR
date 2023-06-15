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
        const hologramManipulatorElements = this.hologramViewCopies.get(hologramName);

        hologramManipulatorElements.x.dispose();
        hologramManipulatorElements.y.dispose();
        hologramManipulatorElements.z.attachedMesh = null;
        hologramManipulatorElements.z.dispose();
    }

    #addManipulatorMenu(hologramName, menuPosition) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.hologramModel.holograms.get(hologramName);
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.HolographicButton("manipulate", false);//new BABYLON.GUI.TouchHolographicButton();
        manipulatorNearMenu.addButton(controlButton);

        this.#setDefaultControlButtonBehavior(hologramName, controlButton)
        this.hologramsManipulatorMenu.set(hologramName, new Pair(manipulatorNearMenu, controlButton));
    }

    #setDefaultControlButtonBehavior(hologramName, controlButton) {
        controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
        controlButton.frontMaterial.albedoColor = BABYLON.Color3.Blue();
        controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.37, 0.67);
        controlButton.text = "Manipulate";
        controlButton.imageUrl = "../../img/IconAdjust.png";
        controlButton.onPointerDownObservable.clear();


        controlButton.onPointerDownObservable.add(() => {
            this.#addHologramManipulator(hologramName);
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

    #addHologramManipulator(hologramName){
        const box = this.#constructBox(this.model.hologramModel.holograms.get(hologramName));
        box.isVisible = false;

        const boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(box);
        const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene);
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        const gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer)
        gizmo.rotationSphereSize = 0.03;
        gizmo.scaleBoxSize = 0.03;
        gizmo.attachedMesh = boundingBox;

        // Create behaviors to drag and scale with pointers in VR
        const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        sixDofDragBehavior.dragDeltaRatio = 1;
        sixDofDragBehavior.zDragFactor = 1;
        sixDofDragBehavior.onPositionChangedObservable.add(() => {
            //this.notifyHologramPositionChanged(hologram.absolutePosition);
        });
        boundingBox.addBehavior(sixDofDragBehavior);

        gizmo.onScaleBoxDragObservable.add(() => {
            //this.notifyHologramScaleChanged(hologram.absoluteScaling);
        });

        gizmo.onRotationSphereDragObservable.add(() => {
            //this.notifyHologramRotationChanged(hologram.absoluteRotationQuaternion);
        });

        this.hologramViewCopies.set(hologramName, new Triple(box, boundingBox, gizmo));
    }

    #constructBox(hologram) {
        let min = null;
        let max = null;
        hologram.getChildMeshes().forEach((mesh) => {
            const boxInfo = mesh.getBoundingInfo().boundingBox;
            if (min === null) {
                min = new BABYLON.Vector3();
                min.copyFrom(boxInfo.minimum);
            }

            if (max === null) {
                max = new BABYLON.Vector3();
                max.copyFrom(boxInfo.maximum);
            }

            min.x = boxInfo.minimum.x < min.x ? boxInfo.minimum.x : min.x;
            min.y = boxInfo.minimum.y < min.y ? boxInfo.minimum.y : min.y;
            min.z = boxInfo.minimum.z < min.z ? boxInfo.minimum.z : min.z;

            max.x = boxInfo.maximum.x > max.x ? boxInfo.maximum.x : max.x;
            max.y = boxInfo.maximum.y > max.y ? boxInfo.maximum.y : max.y;
            max.z = boxInfo.maximum.z > max.z ? boxInfo.maximum.z : max.z;
        })

        const size = max.subtract(min);

        const box = BABYLON.MeshBuilder.CreateBox("bounds", {size: 1}, this.model.scene);
        const multiplyFactor = 0.5
        box.scaling.copyFrom(new BABYLON.Vector3(size.x * multiplyFactor, size.y * multiplyFactor, size.z * multiplyFactor));
        box.position = hologram.position;
        box.position.y = box.position.y + 0.2

        return box;
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("addManipulatorMenu", (data) => {
            console.log("VIEW: received add manipulator menu");
            const object = JSON.parse(data);
            const hologramName = object.name;
            const menuPosition = object.position;

            console.log("name ");
            console.log(hologramName);
            console.log("position ")
            console.log(menuPosition);

            this.#addManipulatorMenu(hologramName, menuPosition, );
        })
    }
}



export { RootView };