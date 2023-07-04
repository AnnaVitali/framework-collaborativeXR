import {eventEmitter} from "../event/event_emitter.js";
import {StandardShape} from "../hologram/standard_shape.js";

class ImportedHologramModel extends Croquet.Model {

    init(options={}){
        super.init();
        this.debug = true;
        this.hologramName = null
        this.hologram = null;
    }

    setScene(scene){
        this.scene = scene;
    }

    createNewImportedHologramInstance(hologramObject){
        this.#log("receive");
        console.log(hologramObject);
        console.log(this.scene);

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

                this.hologramName = hologramName
                this.hologram = container.meshes[0];

                this.#log("POSITION: " + this.hologram.position);
                this.#log("ROTATION: " + this.hologram.rotation);
                this.#log("SCALE: " + this.hologram.scaling);

                eventEmitter.emit("importedHologramCreated", "");
            }catch(error){
                this.log("ERROR " + error);
            }
        });
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
            console.log("IH-MODEL " + message);
        }
    }

    static types() {
        return {
            "BABYLON.Mesh": BABYLON.Mesh,
            "BABYLON.Scene": BABYLON.Scene,
        };
    }
}

ImportedHologramModel.register("ImportedHologramModel");


export {ImportedHologramModel};