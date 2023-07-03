import {eventEmitter} from "../event/event_emitter.js";
import {StandardShape} from "../hologram/standard_shape.js";

class HologramModel extends Croquet.Model {

    init(options={}){
        super.init();
        this.debug = true;
        this.holograms = new Map();

        this.#setupBackEndEventHandlers();
    }

    setScene(scene){
        this.scene = scene;
    }

    createNewImportedHologramInstance(hologramData){
        this.#log("HOLOGRAM MODEL: receive");
        this.#log(hologramData);
        const object = JSON.parse(hologramData);
        const hologramObject = object.hologram;
        const hologramName = hologramObject._name;
        const filePath = hologramObject._meshFilePath;
        const scaling = hologramObject._scaling;
        const euler = new BABYLON.Quaternion(hologramObject._rotation._x,
            hologramObject._rotation._y, hologramObject._rotation._z, hologramObject._rotation._w).toEulerAngles();
        const position = new BABYLON.Vector3(hologramObject._position._x, hologramObject._position._y,
            hologramObject._position._z);
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

                this.holograms.set(hologramName, container.meshes[0]);

                this.#log("POSITION: " + this.holograms.get(hologramName).position);
                this.#log("ROTATION: " + this.holograms.get(hologramName).rotation);
                this.#log("SCALE: " + this.holograms.get(hologramName).scaling);

                eventEmitter.emit("importedHologramCreated", "");
            }catch(error){
                throw new Error(error)
            }
        });
    }

    createNewStandardHologramInstance(hologramData){
        this.#log("HOLOGRAM MODEL: receive");
        this.#log(hologramData);
        const object = JSON.parse(hologramData);
        const hologramObject = object.hologram;
        const hologramName = hologramObject._name;
        const euler = new BABYLON.Quaternion(hologramObject._rotation._x,
            hologramObject._rotation._y, hologramObject._rotation._z, hologramObject._rotation._w).toEulerAngles();
        const position = new BABYLON.Vector3(hologramObject._position._x, hologramObject._position._y,
            hologramObject._position._z);

        const mesh = this.#computeMesh(hologramObject, hologramName);
        mesh.position = position;
        mesh.rotate(BABYLON.Axis.X, euler.x);
        mesh.rotate(BABYLON.Axis.Y, euler.y);
        mesh.rotate(BABYLON.Axis.Z, euler.z);

        this.holograms.set(hologramName, mesh);
    }

    #computeMesh(hologramObject, hologramName) {
        let mesh = null
        switch (hologramObject._shapeName) {
            case StandardShape.Cube:
                mesh = BABYLON.MeshBuilder.CreateBox(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Sphere:
                mesh =BABYLON.MeshBuilder.CreateSphere(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Cylinder:
                mesh =BABYLON.MeshBuilder.CreateCylinder(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Plane:
                mesh = BABYLON.MeshBuilder.CreatePlane(hologramName, hologramObject._creationOptions, this.scene);
                break;
            case StandardShape.Disc:
                mesh = BABYLON.MeshBuilder.CreateDisc(hologramName, hologramObject._creationOptions, this.scene);
                break;
            default:
                throw new Error("The required shape is not supported");
        }

        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(hologramObject._color);

        mesh.material = material;

        return mesh;
    }

    #updateColor(data){
        const object = JSON.parse(data);
        const hologramName = object.name;
        const colorString  = object.color;

        console.log(data);
        console.log(this.holograms)
        this.#log("name: " + hologramName)

        const mesh = this.holograms.get(hologramName);
        console.log(mesh)
        mesh.material.diffuseColor = BABYLON.Color3.FromHexString(colorString);
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("colorChange", (data) => {
            this.#updateColor(data)
        })
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
        if(this.debug){
            console.log(message);
        }
    }

    static types() {
        return {
            "BABYLON.Mesh": BABYLON.Mesh,
        };
    }
}

HologramModel.register("HologramModel");


export {HologramModel};