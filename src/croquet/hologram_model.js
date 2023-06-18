import {eventEmitter} from "../event/event_emitter.js";
import {Triple} from "../utility/triple.js";
import {Pair} from "../utility/pair.js";

class HologramModel extends Croquet.Model {

    init(options={}){
        super.init();
        this.holograms = new Map();
        this.isUserManipulating = false;
        this.viewInControl = null;

        this.#setupViewEventHandlers();
    }

    setScene(scene){
        this.scene = scene;
    }

    createNewHologramInstance(hologram){
        console.log("HOLOGRAM MODEL: receive");
        console.log(hologram);
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


        console.log("HOLOGRAM MODEL: " + directory);
        console.log("HOLOGRAM MODEL: " + stringSplit[stringSplit.length - 1]);

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

                container.meshes[0].registerAfterWorldMatrixUpdate(((mesh) => {
                    console.log("CHANGE " + this.viewInControl);
                }))

                this.holograms.set(hologramName, new Triple(container.meshes[0], filePath, new Pair(scaling, euler)));

                console.log("POSITION: " + this.holograms.get(hologramName).position);
                console.log("ROTATION: " + this.holograms.get(hologramName).rotation);
                console.log("SCALE: " + this.holograms.get(hologramName).scaling);

                eventEmitter.emit("hologramCreated", "");
            }catch(error){
                throw new Error(error)
            }
        });
    }

    updatePosition(data){
        const hologramName = data.hologramName;
        console.log("MODEL: received position changed " + hologramName);
        /*

        try {
            const hologram = this.holograms.get(hologramName)._x
            const hologramParent = hologram.parent;

            if (typeof data.high !== undefined) {
                hologramParent.position = new BABYLON.Vector3(data.position_x, data.position_y - data.high, data.position_z);
            }else{
                hologramParent.position = new BABYLON.Vector3(data.position_x, data.position_y, data.position_z);
            }

            hologram.rotate(BABYLON.Axis.X, 0);
            hologram.rotate(BABYLON.Axis.Y, 0);
            hologram.rotate(BABYLON.Axis.Z, 0);
        }catch(error){
            //silently ignore
        }*/
    }

    updateScale(data){
        const hologramName = data.hologramName;
        console.log("MODEL: received scale changed" + hologramName);

        try {
            const hologram = this.holograms.get(hologramName)._x
            hologram.scaling = new BABYLON.Vector3(data.scale_x, data.scale_y, data.scale_z);

            hologram.rotate(BABYLON.Axis.X, 0);
            hologram.rotate(BABYLON.Axis.Y, 0);
            hologram.rotate(BABYLON.Axis.Z, 0);
        }catch(error){
            //silently ignore
        }
    }

    manageUserHologramControl(data){
        console.log("MODEL: received manage user hologram control");
        console.log("data:");
        console.log(data);
        this.isUserManipulating = true;
        this.viewInControl = data.view;

        console.log(this.linkedViews)
        /*this.linkedViews.filter(v => data.view !== v).forEach(v => {
            this.publish(v, "freezeControlButton", {hologramName: data.hologramName});
            console.log("v:" + v);
        });*/
    }

    #setupViewEventHandlers(){
        this.subscribe("hologram", "positionChanged", this.updatePosition);
        this.subscribe("hologram", "scaleChanged", this.updateScale);
        this.subscribe("controlButton", "clicked", this.manageUserHologramControl);
    }

    #extractFileAndDirectory(filePath) {
        const stringSplit = filePath.split("/");
        let directory = "";
        for (let i = 0; i < (stringSplit.length - 1); i++){
            directory += stringSplit[i] + "/";
        }

        return {stringSplit, directory};
    }
}

HologramModel.register("HologramModel");


export {HologramModel};