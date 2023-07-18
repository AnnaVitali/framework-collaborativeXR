import {StandardShape} from "../../core/hologram/enum/standard_shape.js";
import {Vector3} from "../../utility/vector3.js";
import {infrastructureEventManager} from "../utility/infrastructure_event_manager.js";

/**
 * Class in charge of the graphic rendering of the hologram
 */
class HologramRenderer{

    /**
     * Constructor of the class.
     * @param scene {BABYLON.Scene} the scene of reference.
     */
    constructor(scene) {
        this.mesh = null;
        this.scene = scene;
        this.isUserManipulating = false;
    }

    /**
     * Render an imported hologram.
     * @param hologram {CroquetImportedHologram} the hologram to render.
     */
    renderImportedHologram(hologram){
        const filePath = hologram._meshFilePath;
        const scaling = hologram._scaling;
        const euler = new BABYLON.Quaternion(hologram._rotation._x,
            hologram._rotation._y, hologram._rotation._z, hologram._rotation._w).toEulerAngles();
        const position = new BABYLON.Vector3(hologram._position._x, hologram._position._y,
            hologram._position._z);
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

                infrastructureEventManager.sendEvent("importedHologramCreated", "");
            }catch(error){
                this.#log("ERROR " + error);
            }
        });
    }

    /**
     * Render a standard hologram.
     * @param hologram {CroquetStandardHologram} the hologram to render.
     */
    renderStandardHologram(hologram){
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
        this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(hologram._color);

        infrastructureEventManager.sendEvent("standardHologramCreated", "");
    }

    /**
     * Render the bounding box of the hologram to show other user manipulation.
     */
    showOtherUserManipulation(){
        this.isUserManipulating = true;
        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);

        const utilLayer = new BABYLON.UtilityLayerRenderer(this.scene);
        utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

        this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FF0000"), utilLayer);
        this.gizmo.rotationSphereSize = 0;
        this.gizmo.scaleBoxSize = 0;
        this.gizmo.attachedMesh = this.boundingBox;

    }

    /**
     * Add a hologram manipulator to the element.
     */
    addHologramManipulator(){
        this.isUserManipulating = true;
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

    /**
     * Remove the element of the hologram manipulator.
     */
    removeElementHologramManipulator(){
        this.gizmo.attachedMesh = null;
        this.gizmo.dispose();
        this.boundingBox.getChildren().forEach(child => child.setParent(null));
        this.boundingBox.dispose;
    }

    /**
     * Get the SixDofDragBehaviour associated to the element.
     * @returns {BABYLON.SixDofDragBehavior}
     */
    getSixDofDragBehaviour(){
        return this.sixDofDragBehavior;
    }

    /**
     * Get the gizmo associated to the element.
     * @returns {BABYLON.BoundingBoxGizmo}
     */
    getGizmo(){
        return this.gizmo
    }

    /**
     * Update the position of the hologram.
     * @param newPosition {Vector3} the new Position to assign.
     */
    updatePosition(newPosition){
        if(this.isUserManipulating) {
            this.boundingBox.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
        }else{
            this.mesh.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
        }
    }

    /**
     * Update the rotation of the hologram
     * @param newRotation {Quaternion} the new rotation to assign.
     */
    updateRotation(newRotation){
        const euler = new BABYLON.Quaternion(newRotation._x,
            newRotation._y, newRotation._z, newRotation._w).toEulerAngles();
        this.mesh.rotate(BABYLON.Axis.X, euler.x);
        this.mesh.rotate(BABYLON.Axis.Y, euler.y);
        this.mesh.rotate(BABYLON.Axis.Z, euler.z);
    }

    /**
     * Update the scale of the hologram.
     * @param newScale {Vector3} the new scale to assign.
     */
    updateScale(newScale){
        if(this.isUserManipulating) {
            this.boundingBox.scaling = new BABYLON.Vector3(newScale._x, newScale._y, newScale._z);
        }else{
            this.mesh.scaling = new BABYLON.Vector3(newScale._x, newScale._y, newScale._z);
        }
    }

    /**
     * Update the hologram color.
     * @param color {String} the new color to apply.
     */
    updateColor(color){
        this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(color);
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