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
    }

    #addManipulatorMenu(hologramName, menuPosition, buttonProperties) {
        const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
        manipulatorNearMenu.rows = 1;
        this.model.GUIManager.addControl(manipulatorNearMenu);
        manipulatorNearMenu.isPinned = true;

        manipulatorNearMenu.parent = this.model.hologramModel.holograms.get(hologramName);
        manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);

        const controlButton = new BABYLON.GUI.TouchHolographicButton();
        this.#setDefaultControlButtonBehavior(hologramName, controlButton, buttonProperties)

        manipulatorNearMenu.addButton(controlButton);

        this.hologramsManipulatorMenu.set(hologramName, new Pair(manipulatorNearMenu, controlButton));
    }

    #setDefaultControlButtonBehavior(hologramName, controlButton, buttonProperties) {
        controlButton.text = buttonProperties._text;
        controlButton.imageUrl = buttonProperties._imgFilePath;
        controlButton.onPointerDownObservable.clear();

        controlButton.onPointerDownObservable.add(() => {
            this.#addHologramManipulator(hologramName);
            //this.notifyUserStartManipulating();
        });
    }

    #addHologramManipulator(hologramName){
        const box = this.constructBox(this.model.hologramModel.holograms.get(hologramName));
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

        /*

        sixDofDragBehavior.onPositionChangedObservable.add(() => {
            this.notifyHologramPositionChanged(hologram.absolutePosition);
        });
        this.boundingBox.addBehavior(sixDofDragBehavior);

        this.gizmo.onScaleBoxDragObservable.add(() => {
            this.notifyHologramScaleChanged(hologram.absoluteScaling);
        });

        this.gizmo.onRotationSphereDragObservable.add(() => {
            this.notifyHologramRotationChanged(hologram.absoluteRotationQuaternion);
        });


        this.controlButton.text = "Stop manipulating";
        this.controlButton.onPointerDownObservable.clear();
        this.controlButton.onPointerDownObservable.add(() => {
            this.notifyCurrentUserReleaseControl();
        });*/
    }

    constructBox(hologram) {
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
        console.log("Size: " + size);
        console.log("Size: " + size.multiplyByFloats(0.5));
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
            const buttonProperties = object.buttonProperties;

            console.log("name ");
            console.log(hologramName);
            console.log("position ")
            console.log(menuPosition);
            console.log("button properties ")
            console.log(buttonProperties);

            this.#addManipulatorMenu(hologramName, menuPosition, buttonProperties);
        })
    }
}



export { RootView };