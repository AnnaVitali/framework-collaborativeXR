class ManipulatorView extends Croquet.View {
    constructor(model, hologramName, parentView){
        super(model);
        this.model = model;
        this.parentView = parentView;
        this.hologramName = hologramName;
    }

    showOtherUserManipulation(){
        const hologram = this.model.holograms.get(this.hologramName);

        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(hologram);

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene);
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FF0000"), utilLayer);
        this.gizmo.rotationSphereSize = 0;
        this.gizmo.scaleBoxSize = 0;
        this.gizmo.attachedMesh = this.boundingBox;

    }

    updateHologram(data){
        console.log("MANIPULATOR-VIEW: received update holograms");

        const position = new BABYLON.Vector3(data.position_x, data.position_y, data.position_z);
        const scaling = new BABYLON.Vector3(data.scale_x, data.scale_y, data.scale_z);
        this.boundingBox.position = position;
        this.boundingBox.scaling = scaling;
    }

    addHologramManipulator(){
        console.log("MANIPULATOR-VIEW: publish showUserManipulation");
        console.log("parent view " + this.parentView);
        this.publish("hologramManipulator", "showUserManipulation", {view: this.parentView, hologramName: this.hologramName});
        const hologram = this.model.holograms.get(this.hologramName);

        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(hologram);

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.model.scene)
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), utilLayer)
        this.gizmo.rotationSphereSize = 0;
        this.gizmo.scaleBoxSize = 0.03;
        this.gizmo.attachedMesh = this.boundingBox;

        const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        sixDofDragBehavior.dragDeltaRatio = 1;
        sixDofDragBehavior.zDragFactor = 1;

        this.boundingBox.addBehavior(sixDofDragBehavior);

        sixDofDragBehavior.onPositionChangedObservable.add(() => {
            this.publish("updateHologram", "showChanges", this.#serializeDataToSend());
        });
        this.boundingBox.addBehavior(sixDofDragBehavior);

        this.gizmo.onScaleBoxDragObservable.add(() => {
            this.publish("updateHologram", "showChanges", this.#serializeDataToSend());
        });
    }

    removeElementHologramManipulator(){
        this.gizmo.attachedMesh = null;
        this.gizmo.dispose();
        this.boundingBox.getChildren().forEach(child => child.setParent(null));
        this.boundingBox.dispose;
    }

    #serializeDataToSend(){
        return {
            hologramName: this.hologramName,
            view: this.parentView,
            position_x: this.boundingBox.absolutePosition.x,
            position_y: this.boundingBox.absolutePosition.y,
            position_z: this.boundingBox.absolutePosition.z,
            scale_x: this.boundingBox.absoluteScaling.x,
            scale_y: this.boundingBox.absoluteScaling.y,
            scale_z: this.boundingBox.absoluteScaling.z
        };
    }
}

export{ManipulatorView}