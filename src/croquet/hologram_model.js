class HologramModel extends Croquet.Model {

    init(options={}){
        super.init();
        this.holograms = new Map();
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

        const stringSplit = hologramObject._meshFilePath.split("/");
        let directory = "";
        for (let i = 0; i < (stringSplit.length - 1); i++){
            directory += stringSplit[i] + "/";
        }

        console.log("HOLOGRAM MODEL: " + directory);
        console.log("HOLOGRAM MODEL: " + stringSplit[stringSplit.length - 1]);

        BABYLON.SceneLoader.ImportMeshAsync(
            "",
            directory,
            stringSplit[stringSplit.length - 1],
            this.scene
        ).then((result) => {
            console.log(result.meshes[0])
            result.meshes[0].position = new BABYLON.Vector3(hologramObject._position._x,
                hologramObject._position._y, hologramObject._position._z);
            result.meshes[0].rotation = new BABYLON.Quaternion(hologramObject._rotation._x,
                hologramObject._rotation._y, hologramObject._rotation._z, hologramObject._rotation._w);
            result.meshes[0].scaling = new BABYLON.Vector3(hologramObject._scaling._x, hologramObject._scaling._y,
                hologramObject._scaling._z);

            //console.log(mesh.absolutePosition);
            this.holograms.delete(hologramName);
            this.holograms.set(hologramName, result.meshes[0]);
            console.log("POSITION: " + this.holograms.get(hologramName).position);
            console.log("ROTATION: " + this.holograms.get(hologramName).rotation);
            console.log("SCALE: " + this.holograms.get(hologramName).scaling);
        });


    }
}

HologramModel.register("HologramModel");


export {HologramModel};