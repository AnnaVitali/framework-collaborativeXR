import {StandardShape} from "../hologram/standard_shape.js";

class HologramRenderer{
    constructor(scene) {
        this.mesh = null;
        this.scene = scene;
    }

    renderStandardHologram(hologram){
        const hologramName = hologram.name;
        const euler = new BABYLON.Quaternion(hologram.rotation._x,
            hologram.rotation.y, hologram.rotation.z, hologram.rotation.w).toEulerAngles();
        const position = new BABYLON.Vector3(hologram.position.x, hologram.position.y,
            hologram.position.z);

       this.#computeMesh(hologram, hologramName);
        this.mesh.position = position;
        this.mesh.rotate(BABYLON.Axis.X, euler.x);
        this.mesh.rotate(BABYLON.Axis.Y, euler.y);
        this.mesh.rotate(BABYLON.Axis.Z, euler.z);
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

    updateColor(colorString){
        this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(colorString);
    }
}

export {HologramRenderer}