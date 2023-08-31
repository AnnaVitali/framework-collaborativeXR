import {StandardShape} from "../../core/hologram/enum/standard_shape.js";
import {Vector3} from "../../utility/vector3.js";
import {infrastructureEventManager} from "../utility/infrastructure_event_manager.js";

/**
 * Class in charge of the graphic rendering of the hologram.
 */
class HologramRenderer{

    /**
     * Constructor of the class.
     * @param scene {BABYLON.Scene} the scene of reference.
     * @param utilityLayer {BABYLON.UtilityLayerRenderer} the utility layer of reference.
     */
    constructor(scene, utilityLayer) {
        this.scene = scene;
        this.utilityLayer = utilityLayer
    }

    /**
     * Initialize the element to allow the user to manipulate the hologram.
     */
    initializeElementManipulation(){
        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);
        this._sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
        this._sixDofDragBehavior.dragDeltaRatio = 1.2;
        this._sixDofDragBehavior.zDragFactor = 1.2;
    }

    /**
     * Render an imported hologram.
     * @param hologram {ImportedHologramClone} the hologram to render.
     */
    renderImportedHologram(hologram){
        const filePath = hologram._meshFilePath;
        const scaling = new BABYLON.Vector3(hologram._scaling._x, hologram._scaling._y, hologram._scaling._z);
        const euler = new BABYLON.Quaternion(hologram._rotation._x,
            hologram._rotation._y, hologram._rotation._z, hologram._rotation._w).toEulerAngles();
        const position = new BABYLON.Vector3(hologram._position._x, hologram._position._y,
            hologram._position._z);
        const {stringSplit, directory} = this.#extractFileAndDirectory(filePath);

        BABYLON.SceneLoader.LoadAssetContainer(directory, stringSplit[stringSplit.length - 1], this.scene, (container) => {
            try{
                container.addAllToScene();
                container.meshes[0].rotationQuaternion = null;

                container.meshes[0].rotate(BABYLON.Axis.X, euler.x);
                container.meshes[0].rotate(BABYLON.Axis.Y, euler.y);
                container.meshes[0].rotate(BABYLON.Axis.Z, euler.z);

                container.meshes[0].position = position

                container.meshes[0].scaling = scaling;

                this.mesh = container.meshes[0];
                infrastructureEventManager.sendEvent("importedHologramCreated" + hologram.name, "");
            }catch(error){
                this.#log("ERROR " + error);
            }
        });
    }

    /**
     * Render a standard hologram.
     * @param hologram {StandardHologramClone} the hologram to render.
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

        infrastructureEventManager.sendEvent("standardHologramCreated" + hologram.name, "");
    }

    /**
     * Render the bounding box of the hologram to show other user manipulation.
     */
    showOtherUserManipulation(){
        this._gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FF0000"), this.utilityLayer);
        this._gizmo.rotationSphereSize = 0;
        this._gizmo.scaleBoxSize = 0;
        this._gizmo.attachedMesh = this.boundingBox;
    }

    /**
     * Add a hologram manipulator to the element.
     */
    addHologramManipulator(){
        this._gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), this.utilityLayer)
        this._gizmo.rotationSphereSize = 0.05;
        this._gizmo.scaleBoxSize = 0.05;
        this._gizmo.attachedMesh = this.boundingBox;

        this.boundingBox.addBehavior(this._sixDofDragBehavior);
    }

    /**
     * Remove the element of the hologram manipulator.
     */
    removeHologramManipulator(){
        this._gizmo.attachedMesh = null;
        this._gizmo.dispose();
        this._gizmo = null;
        this.boundingBox.removeBehavior(this._sixDofDragBehavior);
    }

    /**
     * Update the position of the hologram due to a manipulation.
     * @param newPosition {Vector3} the new position to assign.
     */
    updatePositionDueManipulation(newPosition){
        this.boundingBox.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
    }

    /**
     * Update the position of the hologram.
     * @param newPosition {Vector3} the new position to assign.
     */
    updatePosition(newPosition){
        if(this.boundingBox !== null){
            this.#removeBoundingBox();
            this.mesh.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
            this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);
        }else{
            this.mesh.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
        }
    }

    /**
     * Update the rotation of the hologram.
     * @param newRotation {Quaternion} the new rotationSphere1 to assign.
     */
    updateRotation(newRotation){
        const euler = new BABYLON.Quaternion(newRotation._x,
            newRotation._y, newRotation._z, newRotation._w).toEulerAngles();
        this.mesh.rotate(BABYLON.Axis.X, euler.x);
        this.mesh.rotate(BABYLON.Axis.Y, euler.y);
        this.mesh.rotate(BABYLON.Axis.Z, euler.z);
    }

    /**
     * Update the scale of the hologram due to a manipulation.
     * @param newScaling {Vector3} the new scale to assign.
     */
    updateScalingDueManipulation(newScaling){
        this.boundingBox.scaling = new BABYLON.Vector3(newScaling._x, newScaling._y, newScaling._z);
    }

    /**
     * Update the scale of the hologram.
     * @param newScaling {Vector3} the new scale to assign.
     */
    updateScaling(newScaling){
        if(this.boundingBox !== null){
            this.#removeBoundingBox();
            this.mesh.scaling = new BABYLON.Vector3(newScaling._x, newScaling._y, newScaling._z);
            this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);
        }else{
            this.mesh.scaling = new BABYLON.Vector3(newScaling._x, newScaling._y, newScaling._z);
        }
    }

    /**
     * Update the hologram color.
     * @param color {String} the new colorSphere to apply.
     */
    updateColor(color){
        this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(color);
    }

    /**
     * Get the mesh associated to the renderer.
     * @returns {BABYLON.Mesh}
     */
    getHologramMesh(){
        return this.mesh;
    }

    /**
     * Get the six degree of freedom drag behaviour associated to the renderer for the manipulation.
     * @returns {BABYLON.SixDofDragBehavior}
     */
    get sixDofDragBehavior(){
        return this._sixDofDragBehavior;
    }

    /**
     * Get the gizmo associated to the renderer for the manipulation.
     */
    get gizmo(){
        return this._gizmo;
    }

    #removeBoundingBox() {
        this.mesh.setParent(null);
        this.boundingBox.dispose();
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
        const debug = false;
        if(debug){
            console.log("H-RENDERER: " + message);
        }
    }
} 

export {HologramRenderer}