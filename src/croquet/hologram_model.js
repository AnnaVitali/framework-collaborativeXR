import {eventEmitter} from "../event/event_emitter.js";
import {Triple} from "../utility/triple.js";
import {Pair} from "../utility/pair.js";

class HologramModel extends Croquet.Model {

    init(options={}){
        super.init();
        this.debug = true;
        this.holograms = new Map();

        this.#setupViewEventHandlers();
    }

    setScene(scene){
        this.scene = scene;
    }

    createNewHologramInstance(hologram){
        this.#log("HOLOGRAM MODEL: receive");
        this.#log(hologram);
        const object = JSON.parse(hologram)
        const hologramName = object.name;
        const hologramObject = object.hologram;
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

                const box = BABYLON.MeshBuilder.CreateBox("box", {size: 1});
                box.isVisible = false;
                box.position = position;
                box.rotate(BABYLON.Axis.X, euler.x);
                box.rotate(BABYLON.Axis.Y, euler.y);
                box.rotate(BABYLON.Axis.Z, euler.z);

                container.meshes[0].parent = box;
                container.meshes[0].position = new BABYLON.Vector3(0, 0, 0)

                container.meshes[0].scaling.scaleInPlace(scaling);
                container.meshes[0].markAsDirty("rotation");

                this.holograms.set(hologramName, new Triple(container.meshes[0], filePath, new Pair(scaling, euler)));

                this.#log("POSITION: " + this.holograms.get(hologramName).position);
                this.#log("ROTATION: " + this.holograms.get(hologramName).rotation);
                this.#log("SCALE: " + this.holograms.get(hologramName).scaling);

                eventEmitter.emit("hologramCreated", "");
            }catch(error){
                throw new Error(error)
            }
        });
    }

    #setupViewEventHandlers(){
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
}

HologramModel.register("HologramModel");


export {HologramModel};