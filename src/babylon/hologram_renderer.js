import {StandardShape} from "../hologram/standard_shape.js";
import {eventEmitter} from "../event/event_emitter.js";
import {Vector3} from "../utility/vector3.js";

class HologramRenderer{
    constructor(scene) {
        this.mesh = null;
        this.scene = scene;
    }

    renderImportedHologram(hologram){
        const hologramName = hologram.name;
        const filePath = hologram._meshFilePath;
        const scaling = hologram._scaling;
        const euler = new BABYLON.Quaternion(hologram._rotation.x,
            hologram._rotation.y, hologram._rotation.z, hologram._rotation.w).toEulerAngles();
        const position = new BABYLON.Vector3(hologram._position.x, hologram._position.y,
            hologram._position.z);
        const {stringSplit, directory} = this.#extractFileAndDirectory(filePath);

        BABYLON.SceneLoader.LoadAssetContainer(directory, stringSplit[stringSplit.length - 1], this.scene, (container) => {
            try{
                container.addAllToScene();
                container.meshes[0].rotationQuaternion = null;

                const box = BABYLON.MeshBuilder.CreateBox("box", {size: 1});
                box.isVisible = false;
                box.position = position;
                box.rotate(BABYLON.Axis.X, euler.x);
                box.rotate(BABYLON.Axis.Y, euler.y);
                box.rotate(BABYLON.Axis.Z, euler.z);

                container.meshes[0].parent = box;
                container.meshes[0].position = new BABYLON.Vector3(0, 0, 0)

                container.meshes[0].scaling.scaleInPlace(scaling);

                this.mesh = container.meshes[0];

                this.#log("POSITION: " + this.hologram.position);
                this.#log("ROTATION: " + this.hologram._rotation);
                this.#log("SCALE: " + this.hologram._scaling);

                eventEmitter.emit("importedHologramCreated", "");
            }catch(error){
                this.log("ERROR " + error);
            }
        });
    }

    renderStandardHologram(hologram){
        console.log(hologram._scaling)
        const hologramName = hologram.name;
        const euler = new BABYLON.Quaternion(hologram._rotation._x,
        hologram._rotation._y, hologram._rotation._z, hologram._rotation._w).toEulerAngles();
        const position = new BABYLON.Vector3(hologram._position._x, hologram._position._y,
        hologram._position._z);
        this.#computeMesh(hologram, hologramName);
        this.mesh.position = position;
        this.mesh.rotate(BABYLON.Axis.X, euler.x);
        this.mesh.rotate(BABYLON.Axis.Y, euler.y);
        this.mesh.rotate(BABYLON.Axis.Z, euler.z);
    }

    updateColor(colorString){
        this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(colorString);
    }

    #computeMesh(hologramObject, hologramName) {
        switch (hologramObject._shapeName) {
            case StandardShape.Cube:
                this.mesh = BABYLON.MeshBuilder.CreateBox(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Sphere:
                this.mesh =BABYLON.MeshBuilder.CreateSphere(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Cylinder:
                this.mesh =BABYLON.MeshBuilder.CreateCylinder(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Plane:
                this.mesh = BABYLON.MeshBuilder.CreatePlane(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Disc:
                this.mesh = BABYLON.MeshBuilder.CreateDisc(hologramName, hologramObject._creationOptions, this.scene);
                break;
            default:
                throw new Error("The required shape is not supported");
        }

        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(hologramObject._color);

        this.mesh.material = material;
    }

    showOtherUserManipulation(){
        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.scene);
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FF0000"), utilLayer);
        this.gizmo.rotationSphereSize = 0;
        this.gizmo.scaleBoxSize = 0;
        this.gizmo.attachedMesh = this.boundingBox;

    }

    addHologramManipulator(){

        //this.publish("hologramManipulator", "showUserManipulation", {view: this.parentView, hologramName: this.hologramName});

        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.scene)
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), utilLayer)
        this.gizmo.rotationSphereSize = 0;
        this.gizmo.scaleBoxSize = 0.03;
        this.gizmo.attachedMesh = this.boundingBox;

        this.sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        this.sixDofDragBehavior.dragDeltaRatio = 1;
        this.sixDofDragBehavior.zDragFactor = 1;

        this.boundingBox.addBehavior(this.sixDofDragBehavior);

    }

    removeElementHologramManipulator(){
        this.gizmo.attachedMesh = null;
        this.gizmo.dispose();
        this.boundingBox.getChildren().forEach(child => child.setParent(null));
        this.boundingBox.dispose;
    }


    getSixDofDragBehaviour(){
        return this.sixDofDragBehavior;
    }

    getGizmo(){
        return this.gizmo
    }

    updatePosition(newPosition){
        this.boundingBox.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
    }

    updateScale(newScale){
        this.boundingBox.scaling = new BABYLON.Vector3(newScale._x, newScale._y, newScale._z);
    }

    #extractFileAndDirectory(filePath) {
        const stringSplit = filePath.split("/");
        let directory = "";
        for (let i = 0; i < (stringSplit.length - 1); i++){
            directory += stringSplit[i] + "/";
        }

        return {stringSplit, directory};
    }

    #log(message){
        const debug = true;
        if(debug){
            console.log("H-RENDERER: " + message);
        }
    }
}

export {HologramRenderer}