import {eventEmitter} from "../../event/event_emitter.js";
import {StandardShape} from "../../hologram/standard_shape.js";
import {CroquetStandardHologram} from "../hologram/croquet_standard_hologram.js";
import {CroquetImportedHologram} from "../hologram/croquet_imported_hologram.js";

class HologramModel extends Croquet.Model {

    init(options = {}){
        super.init();
        this.holograms = new Map();

        //this.#setupBackEndEventHandlers();
    }

    addHologram(hologram){
        if(!this.holograms.has(hologram.name)) {
            this.holograms.set(hologram.name, hologram);
        }else{
            throw new Error("Hologram with this name already present!");
        }
    }

    updatePosition(hologramName, position){
        this.holograms.get(hologramName).position = position;
    }

    changeColorHologram(hologramName, color){
        this.#log("change hologram color received");
        this.#log(hologramName)
        console.log(this.holograms);
        console.log(this.holograms.get(hologramName));
        this.holograms.get(hologramName).color = color;

        this.publish("view", "updateHologramColor", hologramName);
    }
/*
    setScene(scene){
        this.scene = scene;
    }

    createNewStandardHologramInstance(hologramObject){
        this.#log("HOLOGRAM MODEL: receive");
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

        this.hologram = mesh;
        this.hologramName = hologramName;
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
        const colorString  = object.color;

        this.hologram.material.diffuseColor = BABYLON.Color3.FromHexString(colorString);
    }

    #setupBackEndEventHandlers(){
        eventEmitter.on("colorChange", (data) => {
            this.#updateColor(data)
        })
    }


*/

    #log(message){
        const debug = true;
        if(debug){
            console.log("SH-MODEL: " + message);
        }

    }

    static types() {
        return {
            "CroquetStandardHologram": CroquetStandardHologram,
            "CroquetImportedHologram": CroquetImportedHologram,
        };
    }
}

HologramModel.register("HologramModel");


export {HologramModel};