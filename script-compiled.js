/**
 * Class that represents an event bus, by which send and receive event specifying an handler.
 */
class EventBus {
  /**
   * Empty constructor of the class.
   */
  constructor() {
    this.listeners = [];
  }

  /**
   * Emit a new event on the event bus.
   * @param eventName {String} the name of the event.
   * @param data {String} the data to send.
   */
  emit(eventName, data) {
    this.listeners.filter(({
                             name
                           }) => name === eventName).forEach(({
                                                                callback
                                                              }) => {
      setTimeout(callback.apply(this, [data]), 0);
    });
  }

  /**
   * Handle an event received
   * @param name {String} the name of the event.
   * @param callback the callback to call when the event arrives.
   */
  on(name, callback) {
    if (typeof callback === 'function' && typeof name === 'string') {
      this.listeners.push({
        name,
        callback
      });
    }
  }

  /**
   * Unsubscribe the relative callback to the event.
   * @param eventName {String} name of the event.
   * @param callback the callback to remove.
   */
  off(eventName, callback) {
    this.listeners = this.listeners.filter(listener => !(listener.name === eventName && listener.callback === callback));
  }

  /**
   * Destroy the event bus.
   */
  destroy() {
    this.listeners.length = 0;
  }
}
const eventBus = new EventBus();
export { eventBus };

/**
 * Class representing an animation that can be associated with an element.
 */
class Animation {
  /**
   * Constructor of the class
   * @param name {String} the animation name.
   * @param time {Number} the time scheduling of the animation in ms.
   */
  constructor(name, time) {
    if (elementChecker.verifyNameAlreadyExist(name)) {
      throw new Error("This name was already used!");
    }
    this._name = name;
    this._time = time;
  }

  /**
   * Get the name of the animation.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the time of the animation.
   * @returns {Number}
   */
  get time() {
    return this._time;
  }

  /**
   * Set the callback to call when the time expired.
   * @param callback the callback to apply.
   */
  setAnimationCallback(callback) {
    this.animationCallback = () => {
      setTimeout(callback.apply(this), 0);
    };
    coreEventManager.listenForInfrastructureEvent(this.name, this.animationCallback);
  }

  /**
   * Start the animation specified.
   */
  startAnimation() {
    if (synchronizedElementUpdater.update) {
      coreEventManager.sendEvent("newAnimation", JSON.stringify(this));
    }
  }

  /**
   * Stop the animation specified.
   */
  stopAnimation() {
    if (synchronizedElementUpdater.update) {
      coreEventManager.sendEvent("stopAnimation", JSON.stringify(this.name));
    }
  }
}
export { Animation };

/**
 * Class representing a Button that can be added to a menu.
 */
class Button {
  /**
   * Constructor of the class.
   * @param name {String} the name of the button.
   * @param text {String} the text to display.
   */
  constructor(name, text) {
    this._text = text;
    this._name = name;
  }

  /**
   * Get the name of the button.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the text of the button.
   * @returns {String}
   */
  get text() {
    return this._text;
  }

  /**
   * Set the text of the button.
   * @param value
   */
  set text(value) {
    this._text = value;
  }

  /**
   * Set the callback to call when the button is clicked.
   * @param callback the callback to apply.
   */
  setOnPointerDownCallback(callback) {
    coreEventManager.listenForInfrastructureEvent(this.name, () => {
      if (!synchronizedElementUpdater.update) {
        synchronizedElementUpdater.update = true;
        setTimeout(callback.apply(this), 0);
        synchronizedElementUpdater.update = false;
      } else {
        setTimeout(callback.apply(this), 0);
      }
    });
  }
}
export { Button };

/**
 * Class representing a menu that can be added to the scene.
 */
class Menu {
  /**
   * Constructor of the class.
   * @param position {Vector3} the positionSphere1 of the menu.
   */
  constructor(position) {
    this._position = position;
  }

  /**
   *
   * @returns {Vector3}
   */
  get position() {
    return this._position;
  }
}
export { Menu };

/**
 * Class representing a Menu that allow to manipulate an hologram.
 */
class ManipulatorMenu extends Menu {
  /**
   * Constructor of the class.
   * @param position {Vector3} the positionSphere1 of the menu
   * @param hologramName {String} the name of the hologram to manipulate.
   */
  constructor(position, hologramName) {
    super(position);
    this._position = position;
    this._hologramName = hologramName;
  }
  get hologramName() {
    return this._hologramName;
  }
}
export { ManipulatorMenu };

/**
 * Class that represent a menu that can follow the user.
 */
class NearMenu extends Menu {
  /**
   * Constructor of the class.
   * @param position {Vector3} the positionSphere1 of the menu.
   * @param rows {Number} the number of rows in which the button are organized.
   */
  constructor(position, rows) {
    super(position);
    this.buttonList = [];
    this._rows = rows;
  }

  /**
   * Get the rows of the menu.
   * @returns {Number}
   */
  get rows() {
    return this._rows;
  }

  /**
   * Add a button to the menu.
   * @param button
   */
  addButton(button) {
    this.buttonList.push(button);
  }
}
export { NearMenu };
/**
 * Enum that encloses the property of a hologram.
 * @type {Readonly<{Position: string, Color: string, Scaling: string, Rotation: string}>}
 */
const HologramProperty = Object.freeze({
  Position: "position",
  Rotation: "rotation",
  Scaling: "scaling",
  Color: "color"
});
export { HologramProperty };
/**
 * Enum representing the available standard shape.
 * @type {Readonly<{Sphere: string, Cylinder: string, Cube: string, Plane: string, Disc: string}>}
 */
const StandardShape = Object.freeze({
  Cube: "cube",
  Sphere: "sphere",
  Cylinder: "cylinder",
  Plane: "plane",
  Disc: "disc"
});
export { StandardShape };

/**
 * Class that represent a Hologram that can be rendered.
 */
class Hologram {
  /**
   * Constructor of the class.
   * @param name {String} the name of the hologram.
   * @param position {Vector3} the positionSphere1 of the hologram in the world.
   * @param rotation {Quaternion} the rotationSphere1 of the hologram.
   * @param scaling {Vector3} the scaling of the hologram.
   */
  constructor(name, position, rotation, scaling) {
    this._name = name;
    this._position = position;
    this._rotation = rotation;
    this._scaling = scaling;
  }

  /**
   * Get the scaling of the hologram.
   * @returns {Vector3}
   */
  get scaling() {
    return this._scaling;
  }

  /**
   * Get the rotationSphere1 of the hologram.
   * @returns {Quaternion} the new rotationSphere1.
   */
  get rotation() {
    return this._rotation;
  }

  /**
   * Get the name of the hologram.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the positionSphere1 of the hologram.
   * @returns {Vector3}
   */
  get position() {
    return this._position;
  }

  /**
   * Set the scaling of the hologram.
   * @param value the new scaling.
   */
  set scaling(value) {
    if (synchronizedElementUpdater.update) {
      this._scaling = value;
      coreEventManager.sendEvent("scalingChange", JSON.stringify({
        hologramName: this.name,
        scaling: this.scaling
      }));
    }
  }

  /**
   * Set the positionSphere1 of the hologram.
   * @param value the new positionSphere1.
   */
  set position(value) {
    if (synchronizedElementUpdater.update) {
      this._position = value;
      coreEventManager.sendEvent("positionChange", JSON.stringify({
        hologramName: this.name,
        position: this.position
      }));
    }
  }

  /**
   * Set the rotationSphere1 of the hologram.
   * @param value the new rotationSphere1.
   */
  set rotation(value) {
    if (synchronizedElementUpdater.update) {
      this._rotation = value;
      coreEventManager.sendEvent("rotationChange", JSON.stringify({
        hologramName: this.name,
        rotation: this.rotation
      }));
    }
  }
}
export { Hologram };

/**
 * Class that represents an imported hologram associated with a file that adjusts its graphical rendering.
 */
class ImportedHologram extends Hologram {
  /**
   * Constructor of the class.
   * @param name {String} the name of the hologram.
   * @param meshFilePath {String} the file path for the rendering process.
   * @param position {Vector3} the positionSphere1 of the hologram.
   * @param rotation {Quaternion} the rotationSphere1 of the hologram.
   * @param scaling {Vector3} the scaling of the hologram
   */
  constructor(name, meshFilePath, position, rotation, scaling) {
    super(name, position, rotation, scaling);
    this._meshFilePath = meshFilePath;
  }

  /**
   * Get the file path for teh rendering process.
   * @returns {String}
   */
  get meshFilePath() {
    return this._meshFilePath;
  }
}
export { ImportedHologram };

/**
 * Class representing a standard hologram created from a specific shape.
 */
class StandardHologram extends Hologram {
  /**
   * Constructor of the class.
   * @param name {String} the name of the class.
   * @param shapeName {string} the shape of reference.
   * @param creationOptions {Object} the creation options related to the shape.
   * @param position {Vector3} the hologram positionSphere1.
   * @param rotation {Quaternion} the hologram rotationSphere1.
   * @param color {String} the hologramColor.
   */
  constructor(name, shapeName, creationOptions, position, rotation, color) {
    super(name, position, rotation, null);
    this._creationOptions = creationOptions;
    this._shapeName = shapeName;
    this._color = color;
  }

  /**
   * Get shape name.
   * @returns {StandardShape}
   */
  get shapeName() {
    return this._shapeName;
  }

  /**
   * Get creation options.
   * @returns {Object}
   */
  get creationOptions() {
    return this._creationOptions;
  }

  /**
   * Get the colorSphere of the hologram.
   * @returns {String}
   */
  get color() {
    return this._color;
  }

  /**
   * Set the colorSphere of the hologram.
   * @param value the new colorSphere.
   */
  set color(value) {
    if (synchronizedElementUpdater.update) {
      this._color = value;
      coreEventManager.sendEvent("colorChange", JSON.stringify({
        hologramName: this.name,
        color: this.color
      }));
    }
  }
}
export { StandardHologram };

/**
 * Class that represents the XR scene in which the element are visible.
 */
class Scene {
  /**
   * Constructor of the class.
   * @param sessionManager {SessionManager} representing the current session.
   */
  constructor(sessionManager) {
    if (!sessionManager.isSessionStarted()) {
      throw new Error("Start a session before creating the scene.");
    }
    this.isSceneInitialized = false;
  }

  /**
   * Initialize the scene supporting WebXR.
   */
  initializeScene() {
    this.#log("initialize scene");
    this.isSceneInitialized = true;
    coreEventManager.sendEvent("initialize", "");
  }

  /**
   * Add a new importedHologram to the scene.
   * @param hologram {ImportedHologram} the new hologram to add.
   * @returns {Promise<boolean>} representing the insertion made.
   */
  addImportedHologram(hologram) {
    this.#log("add imported hologram");
    this.#verifyIfSceneIsInitialized();
    this.#verifyIfElementNotExist(hologram.name);
    synchronizedElementUpdater.addHologram(hologram);
    coreEventManager.sendEvent("createImportedHologram", JSON.stringify(hologram));
    return new Promise(resolve => {
      coreEventManager.listenForInfrastructureEvent("importedHologramCreated" + hologram.name, () => {
        resolve(true);
      });
    });
  }

  /**
   * Add a new StandardHologram to the scene
   * @param hologram {StandardHologram} the new hologram to add.
   * @returns {Promise<boolean>} representing the insertion made.
   */
  addStandardHologram(hologram) {
    this.#log("add standard hologram");
    this.#verifyIfSceneIsInitialized();
    this.#verifyIfElementNotExist(hologram.name);
    synchronizedElementUpdater.addHologram(hologram);
    coreEventManager.sendEvent("createStandardHologram", JSON.stringify(hologram));
    return new Promise(resolve => {
      coreEventManager.listenForInfrastructureEvent("standardHologramCreated" + hologram.name, () => {
        resolve(true);
      });
    });
  }

  /**
   * Add a menu that allows to manipulate a hologram.
   * @param manipulatorMenu {ManipulatorMenu} the menu to add
   */
  addManipulatorMenu(manipulatorMenu) {
    this.#log("add manipulator menu");
    this.#verifyIfSceneIsInitialized();
    this.#verifyIfElementExist(manipulatorMenu.hologramName);
    coreEventManager.sendEvent("addManipulatorMenu", JSON.stringify({
      name: manipulatorMenu.hologramName,
      position: manipulatorMenu.position
    }));
  }

  /**
   * Add a nearMenu.
   * @param nearMenu {NearMenu} the menu to add.
   */
  addNearMenu(nearMenu) {
    this.#log("add nearMenu");
    this.#verifyIfSceneIsInitialized();
    if (nearMenu.buttonList.length !== 0) {
      coreEventManager.sendEvent("addNearMenu", JSON.stringify(nearMenu));
    } else {
      throw new Error("Can't add a menu without button!");
    }
  }

  /**
   * Activate the render loop for the scene.
   */
  activateRenderLoop() {
    this.#log("activate render loop");
    this.#verifyIfSceneIsInitialized();
    coreEventManager.listenForSynchronizedElementUpdateEvents();
    coreEventManager.sendEvent("render", "");
  }
  #verifyIfSceneIsInitialized() {
    if (!this.isSceneInitialized) {
      throw new Error("Scene need to be initialized before adding element or activate render loop!");
    }
  }
  #verifyIfElementNotExist(name) {
    if (elementChecker.verifyNameAlreadyExist(name)) {
      throw new Error("Element with this name " + name + " already exist!");
    }
  }
  #verifyIfElementExist(name) {
    if (!elementChecker.verifyNameAlreadyExist(name)) {
      throw new Error("No element exist with this name!");
    }
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("SCENE: " + message);
    }
  }
}
export { Scene };

/**
 * Class used to start or join a session.
 */
class SessionManager {
  /**
   * Constructor of the class.
   */
  constructor() {
    this._sessionStarted = false;
  }

  /**
   * Async method that start a session.
   * @param apiKey {String} the api key.
   * @param appId {String} the app id.
   * @returns {Promise<boolean>}
   */
  async startSession(apiKey, appId) {
    if (typeof apiKey === undefined || typeof appId === undefined) {
      throw new Error("parameters apiKey and appId can't be undefined!");
    }
    this.#log("apiKey: " + apiKey);
    this.#log("appId: " + appId);
    const croquetSession = new CroquetSession();
    await croquetSession.sessionJoin(apiKey, appId);
    return new Promise(resolve => {
      this.#log("SessionManager: session started true");
      this._sessionStarted = true;
      resolve(true);
    });
  }

  /**
   * Add a new  synchronized variable to the session
   * @param variable {SynchronizedVariable}
   */
  addSynchronizedVariable(variable) {
    if (elementChecker.verifyNameAlreadyExist(name)) {
      throw new Error("This name was already used!");
    }
    synchronizedElementUpdater.addSynchronizedVariable(variable);
    coreEventManager.sendEvent("createSynchronizedVariable", JSON.stringify(variable));
  }

  /**
   * Verify if the session is started or not.
   * @returns {boolean} true if the session is started false otherwise
   */
  isSessionStarted() {
    return this._sessionStarted;
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("SESSION-MANAGER:" + message);
    }
  }
}
export { SessionManager };

/**
 * Class representing a synchronized variable for the application.
 */
class SynchronizedVariable {
  /**
   * Constructor of the class.
   * @param name {String} the name of the variable.
   * @param value the value to assign.
   */
  constructor(name, value) {
    this._name = name;
    this._value = value;
  }

  /**
   * Set the value of the variable.
   * @param value
   */
  set value(value) {
    this._value = value;
    coreEventManager.sendEvent("valueChange", JSON.stringify({
      variableName: this.name,
      value: this.value
    }));
  }

  /**
   * Get the name of the variable.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the value of the variable.
   * @returns {*}
   */
  get value() {
    return this._value;
  }
}
export { SynchronizedVariable };

/**
 * Utility class, used to made element consistent.
 */
class CoreEventManager {
  /**
   * Empty constructor of the class.
   */
  constructor() {}

  /**
   * Send a new event to the infrastructure part.
   * @param event {String} the name of the event.
   * @param data {String} the data to send.
   */
  sendEvent(event, data) {
    eventBus.emit(event, data);
  }

  /**
   * Listen for a specific infrastructure event.
   * @param event {String} the name of the event.
   * @param callback the callback to apply when the event is received.
   */
  listenForInfrastructureEvent(event, callback) {
    eventBus.on(event, callback);
  }

  /**
   * Listen for the update event related to synchronized elements.
   */
  listenForSynchronizedElementUpdateEvents() {
    eventBus.on("updateValue", data => {
      const object = JSON.parse(data);
      synchronizedElementUpdater.updateSynchronizedVariable(object.variableName, object.value);
    });
    eventBus.on("updatePosition", data => {
      const object = JSON.parse(data);
      synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Position, object.position);
    });
    eventBus.on("updateRotation", data => {
      const object = JSON.parse(data);
      synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Rotation, object.rotation);
    });
    eventBus.on("updateScaling", data => {
      const object = JSON.parse(data);
      synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Scaling, object.scaling);
    });
    eventBus.on("updateColor", data => {
      const object = JSON.parse(data);
      synchronizedElementUpdater.updateHologram(object.hologramName, HologramProperty.Color, object.color);
    });
  }
}
const coreEventManager = new CoreEventManager();
export { coreEventManager };
/**
 * Utility class used to check if elements exist.
 */
class ElementChecker {
  /**
   * Empty constructor of the class.
   */
  constructor() {
    this.elementNames = [];
  }

  /**
   * Verify if the element specified exist in the scene.
   * @param name {String} the name of the element
   * @returns {boolean} return true of the element exist false otherwise.
   */
  verifyNameAlreadyExist(name) {
    if (this.elementNames.includes(name)) {
      return true;
    } else {
      this.elementNames.push(name);
      return false;
    }
  }
}
const elementChecker = new ElementChecker();
export { elementChecker };
class SynchronizedElementUpdater {
  /**
   * Empty constructor of the class.
   */
  constructor() {
    this.holograms = new Map();
    this.synchronizedVariables = new Map();
    coreEventManager.listenForInfrastructureEvent("setUpdate", () => this.update = true);
  }

  /**
   * Get value of the variable update.
   * @returns {boolean}
   */
  get update() {
    return this._update;
  }

  /**
   * Set if this user has to manage the update or not.
   * @param value
   */
  set update(value) {
    this._update = value;
  }

  /**
   * Add a hologram to the synchronized element.
   * @param hologram {Hologram} the hologram to add.
   */
  addHologram(hologram) {
    this.holograms.set(hologram.name, hologram);
  }

  /**
   * Add a synchronized variable to the synchronized element.
   * @param variable {SynchronizedVariable} the variable to add
   */
  addSynchronizedVariable(variable) {
    this.synchronizedVariables.set(variable.name, variable);
  }

  /**
   * Update the hologram.
   * @param hologramName {String} the name of the hologram.
   * @param property {HologramProperty} the property to update.
   * @param value the new value to assign.
   */
  updateHologram(hologramName, property, value) {
    switch (property) {
      case HologramProperty.Position:
        this.#updatePosition(hologramName, value);
        break;
      case HologramProperty.Rotation:
        this.#updateRotation(hologramName, value);
        break;
      case HologramProperty.Scaling:
        this.#updateScaling(hologramName, value);
        break;
      case HologramProperty.Color:
        this.#updateColor(hologramName, value);
        break;
    }
  }

  /**
   * Update the value of a synchronized variable.
   * @param variableName {String} the name of the variable.
   * @param value the value of the variable.
   */
  updateSynchronizedVariable(variableName, value) {
    this.synchronizedVariables.get(variableName)._value = value;
  }
  #updateColor(hologramName, value) {
    this.holograms.get(hologramName)._color = value;
  }
  #updateScaling(hologramName, value) {
    this.holograms.get(hologramName)._scaling = value;
  }
  #updateRotation(hologramName, value) {
    this.holograms.get(hologramName)._rotation = value;
  }
  #updatePosition(hologramName, value) {
    this.holograms.get(hologramName)._position = value;
  }
}
const synchronizedElementUpdater = new SynchronizedElementUpdater();
export { synchronizedElementUpdater };
/**
 * Class in charge of the graphic rendering of the hologram
 */
class HologramRenderer {
  /**
   * Constructor of the class.
   * @param scene {BABYLON.Scene} the scene of reference.
   */
  constructor(scene) {
    this.mesh = null;
    this.scene = scene;
    this.isUserManipulating = false;
    this.#initializeElementManipulation();
  }
  #initializeElementManipulation() {
    this.utilityLayer = new BABYLON.UtilityLayerRenderer(this.scene);
    this.utilityLayer.utilityLayerScene.autoClearDepthAndStencil = false;
    this.sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    this.sixDofDragBehavior.dragDeltaRatio = 1;
    this.sixDofDragBehavior.zDragFactor = 1;
  }

  /**
   * Render an imported hologram.
   * @param hologram {ImportedHologramClone} the hologram to render.
   */
  renderImportedHologram(hologram) {
    const filePath = hologram._meshFilePath;
    const scaling = new BABYLON.Vector3(hologram._scaling._x, hologram._scaling._y, hologram._scaling._z);
    const euler = new BABYLON.Quaternion(hologram._rotation._x, hologram._rotation._y, hologram._rotation._z, hologram._rotation._w).toEulerAngles();
    const position = new BABYLON.Vector3(hologram._position._x, hologram._position._y, hologram._position._z);
    const {
      stringSplit,
      directory
    } = this.#extractFileAndDirectory(filePath);
    BABYLON.SceneLoader.LoadAssetContainer(directory, stringSplit[stringSplit.length - 1], this.scene, container => {
      try {
        container.addAllToScene();
        container.meshes[0].rotationQuaternion = null;
        container.meshes[0].rotate(BABYLON.Axis.X, euler.x);
        container.meshes[0].rotate(BABYLON.Axis.Y, euler.y);
        container.meshes[0].rotate(BABYLON.Axis.Z, euler.z);
        container.meshes[0].position = position;
        container.meshes[0].scaling = scaling;
        this.mesh = container.meshes[0];
        this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);
        infrastructureEventManager.sendEvent("importedHologramCreated" + hologram.name, "");
      } catch (error) {
        this.#log("ERROR " + error);
      }
    });
  }

  /**
   * Render a standard hologram.
   * @param hologram {StandardHologramClone} the hologram to render.
   */
  renderStandardHologram(hologram) {
    const hologramName = hologram.name;
    const euler = new BABYLON.Quaternion(hologram._rotation._x, hologram._rotation._y, hologram._rotation._z, hologram._rotation._w).toEulerAngles();
    const position = new BABYLON.Vector3(hologram._position._x, hologram._position._y, hologram._position._z);
    this.#computeMesh(hologram, hologramName);
    this.mesh.position = position;
    this.mesh.rotate(BABYLON.Axis.X, euler.x);
    this.mesh.rotate(BABYLON.Axis.Y, euler.y);
    this.mesh.rotate(BABYLON.Axis.Z, euler.z);
    this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(hologram._color);
    this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);
    infrastructureEventManager.sendEvent("standardHologramCreated" + hologram.name, "");
  }

  /**
   * Render the bounding box of the hologram to show other user manipulation.
   */
  showOtherUserManipulation() {
    this.isUserManipulating = true;
    //this.boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh);

    this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FF0000"), this.utilityLayer);
    this.gizmo.rotationSphereSize = 0;
    this.gizmo.scaleBoxSize = 0;
    this.gizmo.attachedMesh = this.boundingBox;
  }

  /**
   * Add a hologram manipulator to the element.
   */
  addHologramManipulator() {
    this.isUserManipulating = true;
    this.gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#FBFF00"), this.utilityLayer);
    this.gizmo.rotationSphereSize = 0;
    this.gizmo.scaleBoxSize = 0.03;
    this.gizmo.attachedMesh = this.boundingBox;
    this.boundingBox.addBehavior(this.sixDofDragBehavior);
  }

  /**
   * Remove the element of the hologram manipulator.
   */
  removeHologramManipulator() {
    this.gizmo.attachedMesh = null;
    this.gizmo.dispose();
    this.gizmo = null;
    this.boundingBox.removeBehavior(this.sixDofDragBehavior);
  }

  /**
   * Update the positionSphere1 of the hologram.
   * @param newPosition {Vector3} the new Position to assign.
   */
  updatePosition(newPosition) {
    if (this.isUserManipulating) {
      this.boundingBox.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
    } else {
      this.mesh.position = new BABYLON.Vector3(newPosition._x, newPosition._y, newPosition._z);
    }
  }

  /**
   * Update the rotationSphere1 of the hologram
   * @param newRotation {Quaternion} the new rotationSphere1 to assign.
   */
  updateRotation(newRotation) {
    const euler = new BABYLON.Quaternion(newRotation._x, newRotation._y, newRotation._z, newRotation._w).toEulerAngles();
    this.mesh.rotate(BABYLON.Axis.X, euler.x);
    this.mesh.rotate(BABYLON.Axis.Y, euler.y);
    this.mesh.rotate(BABYLON.Axis.Z, euler.z);
  }

  /**
   * Update the scale of the hologram.
   * @param newScaling {Vector3} the new scale to assign.
   */
  updateScaling(newScaling) {
    if (this.isUserManipulating) {
      this.boundingBox.scaling = new BABYLON.Vector3(newScaling._x, newScaling._y, newScaling._z);
    } else {
      this.mesh.scaling = new BABYLON.Vector3(newScaling._x, newScaling._y, newScaling._z);
    }
  }

  /**
   * Update the hologram colorSphere.
   * @param color {String} the new colorSphere to apply.
   */
  updateColor(color) {
    this.mesh.material.diffuseColor = BABYLON.Color3.FromHexString(color);
  }
  #computeMesh(hologramObject, hologramName) {
    switch (hologramObject._shapeName) {
      case StandardShape.Cube:
        this.mesh = BABYLON.MeshBuilder.CreateBox(hologramName, hologramObject._creationOptions, this.scene);
        break;
      case StandardShape.Sphere:
        this.mesh = BABYLON.MeshBuilder.CreateSphere(hologramName, hologramObject._creationOptions, this.scene);
        break;
      case StandardShape.Cylinder:
        this.mesh = BABYLON.MeshBuilder.CreateCylinder(hologramName, hologramObject._creationOptions, this.scene);
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
    for (let i = 0; i < stringSplit.length - 1; i++) {
      directory += stringSplit[i] + "/";
    }
    return {
      stringSplit,
      directory
    };
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("H-RENDERER: " + message);
    }
  }
}
export { HologramRenderer };

/**
 * Class that is in charge of managing the scene rendering.
 */
class SceneManager {
  /**
   * Constructor of the class.
   */
  constructor() {
    this.hologramRenders = new Map();
  }

  /**
   * Initialize the WebXr scene.
   */
  initializeScene() {
    const canvas = document.getElementById("renderCanvas");
    this.#log("initialize scene called");
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3.Black();
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.3, -0.3), this.scene);
    camera.minZ = 0.01;
    camera.attachControl(canvas, true);
    camera.inputs.addMouseWheel();
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    light.intensity = 1;
    this.GUIManager = new BABYLON.GUI.GUI3DManager(this.scene);
    this.GUIManager.useRealisticScaling = true;
  }

  /**
   * Activate the render loop.
   */
  activateRenderLoop() {
    this.#log("activate render loop called");
    this.#createWebXRExperience().then(sceneToRender => {
      this.engine.runRenderLoop(() => sceneToRender.render());
    });
  }

  /**
   * Add a standard hologram to the scene.
   * @param hologram {StandardHologramClone} the hologram to add.
   */
  addStandardHologram(hologram) {
    this.#log("addStandardHologram");
    const hologramRender = new HologramRenderer(this.scene);
    hologramRender.renderStandardHologram(hologram);
    this.hologramRenders.set(hologram.name, hologramRender);
  }

  /**
   * Add an imported hologram to the scene.
   * @param hologram {ImportedHologramClone} the hologram to add.
   */
  addImportedHologram(hologram) {
    this.#log("addImportedHologram");
    const hologramRender = new HologramRenderer(this.scene);
    hologramRender.renderImportedHologram(hologram);
    this.hologramRenders.set(hologram.name, hologramRender);
  }

  /**
   * Add a near menu to the scene
   * @param menuPosition {Vector3} the positionSphere1 of the menu.
   * @param menuRows {Number} the number of rows in which the menu is organized.
   * @param buttonList {[Button]} list of button to add at the menu.
   * @returns {[BABYLON.GUI.TouchHolographicButton]} the list of button of the menu
   */
  addNearMenu(menuPosition, menuRows, buttonList) {
    const nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
    let holographicButtonList = [];
    nearMenu.rows = menuRows;
    this.GUIManager.addControl(nearMenu);
    nearMenu.isPinned = true;
    nearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);
    buttonList.forEach(b => {
      const button = new BABYLON.GUI.TouchHolographicButton();
      button.name = b._name;
      button.text = b._text;
      holographicButtonList.push(button);
      nearMenu.addButton(button);
    });
    return holographicButtonList;
  }
  async #createWebXRExperience() {
    const supported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
    let xrHelper;
    if (supported) {
      this.#log("IMMERSIVE AR SUPPORTED");
      xrHelper = await this.scene.createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: 'immersive-ar',
          referenceSpaceType: "local-floor"
        }
      });
    } else {
      this.#log("IMMERSIVE VR SUPPORTED");
      xrHelper = await this.scene.createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: 'immersive-vr'
        }
      });
    }
    try {
      xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xr.input
      });
    } catch (err) {
      this.#log("Articulated hand tracking not supported in this device.");
    }
    return this.scene;
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("SCENE MANAGER: " + message);
    }
  }
}
export { SceneManager };

/**
 * Class responsible to manage the Croquet session.
 */
class CroquetSession {
  /**
   * Empty constructor of the class.
   */
  constructor() {
    this.debug = true;
  }

  /**
   * Join a specific croquet session.
   * @param apiKey {String} the apikey of the session.
   * @param appId {String} the id of the app related to the session.
   * @returns {*} a promise representing the operation performed
   */
  sessionJoin(apiKey, appId) {
    if (this.debug) {
      console.log("Croquet session: session join");
    }
    return Croquet.Session.join({
      apiKey: apiKey,
      appId: appId,
      name: Croquet.App.autoSession(),
      password: Croquet.App.autoPassword(),
      model: RootModel,
      view: RootView,
      autoSleep: false
    });
  }
}
export { CroquetSession };

/**
 * Class representing the root model of the application.
 */
class RootModel extends Croquet.Model {
  /**
   * Initialize the Model.
   * */
  init() {
    this.linkedViews = [];
    this.animationModels = new Map();
    this.hologramModel = HologramModel.create();
    this.synchronizedVariableModel = SynchronizedVariableModel.create();
    this.subscribe(this.sessionId, "view-join", this.viewJoin);
    this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    this.#setupViewEventHandlers();
  }

  /**
   * Handle a new connected view.
   * @param {any} viewId the id of the new view connected.
   */
  viewJoin(viewId) {
    this.#log("received view join");
    this.linkedViews.push(viewId);
  }

  /**
   * Handle the view left event.
   * @param {any} viewId the id of the outgoing view.
   */
  viewDrop(viewId) {
    this.#log("received view left");
    this.linkedViews.splice(this.linkedViews.indexOf(viewId), 1);
    if (viewId === this.viewInCharge) {
      this.viewInCharge = this.linkedViews[0];
      this.publish(this.viewInCharge, "setUpdate");
    }
  }

  /**
   * Create a new animation model.
   * @param data {Object} object containing the information about the animation.
   */
  createNewAnimation(data) {
    this.#log("received create new Animation");
    const animationName = data._name;
    const animationTime = data._time;
    if (!this.animationModels.has(animationName)) {
      this.animationModels.set(animationName, AnimationModel.create({
        name: animationName,
        time: animationTime
      }));
    }
  }

  /**
   * Destroy the animation associated to a specific animation model.
   * @param animationName {String} the name of the animation
   */
  destroyAnimation(animationName) {
    this.#log("received stop animation");
    if (this.animationModels.has(animationName)) {
      this.animationModels.get(animationName).destroy();
      this.animationModels.delete(animationName);
    }
  }

  /**
   * Set the view in charge of sending the update.
   * @param viewId the view id.
   */
  setViewInCharge(viewId) {
    this.viewInCharge = viewId;
  }
  #setupViewEventHandlers() {
    this.subscribe("animation", "createAnimation", this.createNewAnimation);
    this.subscribe("animation", "stopAnimation", this.destroyAnimation);
    this.subscribe("view", "viewInCharge", this.setViewInCharge);
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("MODEL: " + message);
    }
  }
  static types() {
    return {
      "Map": Map
    };
  }
}
RootModel.register("RootModel");
export { RootModel };
/**
 * Class that represents a View in charge of handling a specific animation.
 */
class AnimationModel extends Croquet.Model {
  /**
   * Initialize the Model.
   * @param options {Object} creation options.
   */
  init(options = {}) {
    super.init();
    this.name = options.name;
    this.time = options.time;
    this.future(this.time).tick();
  }

  /**
   * Method to call when the time expired.
   */
  tick() {
    this.#log("model emit" + this.name);
    this.publish("view", "animationTick", this.name);
    this.future(this.time).tick();
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("A-MODEL: " + message);
    }
  }
}
AnimationModel.register("AnimationModel");
export { AnimationModel };

/**
 * Class that represents a model for the holograms in the scene.
 */
class HologramModel extends Croquet.Model {
  /**
   * Init method of the model.
   * @param options {Object} creation options.
   */
  init(options = {}) {
    super.init();
    this.holograms = new Map();
    this.linkedViews = [];
    this.hologramInUserControl = new Map();
    this.subscribe(this.sessionId, "view-join", this.viewJoin);
    this.subscribe(this.sessionId, "view-exit", this.viewDrop);
    this.#setupViewEventHandlers();
  }

  /**
   * Handle a new connected view.
   * @param {any} viewId the id of the new view connected.
   */
  viewJoin(viewId) {
    this.#log("received view join");
    this.linkedViews.push(viewId);
  }

  /**
   * Handle the view left event.
   * @param {any} viewId the id of the outgoing view.
   */
  viewDrop(viewId) {
    this.#log("received view left");
    const values = [...this.hologramInUserControl.values()];
    this.linkedViews.splice(this.linkedViews.indexOf(viewId), 1);
    if (values.includes(viewId)) {
      this.hologramInUserControl.forEach((v, k) => {
        if (v === viewId) {
          this.manageUserHologramControlReleased({
            view: v,
            hologramName: k
          });
        }
      });
    }
  }

  /**
   * Add a new imported hologram
   * @param data {Object} object containing the data of the hologram.
   */
  addImportedHologram(data) {
    const hologram = Object.create(ImportedHologramClone.prototype, Object.getOwnPropertyDescriptors(data.hologram));
    const view = data.view;
    this.#addHologram(hologram, view);
    this.publish(view, "showImportedHologram", hologram.name);
  }

  /**
   * Add a new standard hologram.
   * @param data {Object} object containing the data of the hologram.
   */
  addStandardHologram(data) {
    const hologram = Object.create(StandardHologramClone.prototype, Object.getOwnPropertyDescriptors(data.hologram));
    const view = data.view;
    this.#addHologram(hologram, view);
    this.publish(view, "showStandardHologram", hologram.name);
  }

  /**
   * Update the positionSphere1 of the hologram.
   * @param data {Object} object containing the data of the hologram.
   */
  updatePosition(data) {
    const hologramName = data.hologramName;
    const position = data.position;
    this.holograms.get(hologramName).position = position;
    infrastructureEventManager.sendEvent("updatePosition", JSON.stringify({
      hologramName: hologramName,
      position: position
    }));
    this.publish("view", "updateHologramPosition", hologramName);
  }

  /**
   * Update the scaling of the hologram.
   * @param data {Object} object containing the data of the hologram.
   */
  updateScaling(data) {
    const hologramName = data.hologramName;
    const scaling = data.scaling;
    this.holograms.get(hologramName).scaling = scaling;
    infrastructureEventManager.sendEvent("updateScaling", JSON.stringify({
      hologramName: hologramName,
      scale: scaling
    }));
    this.publish("view", "updateHologramScaling", hologramName);
  }

  /**
   * Update the rotationSphere1 of the hologram.
   * @param data {Object} object containing the data of the hologram.
   */
  updateRotation(data) {
    const hologramName = data.hologramName;
    const rotation = data.rotation;
    this.holograms.get(hologramName).rotation = rotation;
    infrastructureEventManager.sendEvent("updateRotation", JSON.stringify({
      hologramName: hologramName,
      rotation: rotation
    }));
    this.publish("view", "updateHologramRotation", hologramName);
  }

  /**
   * Update the colorSphere of the hologram.
   * @param data {Object} object containing the data of the hologram.
   */
  updateColor(data) {
    const hologramName = data.hologramName;
    const color = data.color;
    this.holograms.get(hologramName).color = color;
    infrastructureEventManager.sendEvent("updateColor", JSON.stringify({
      hologramName: hologramName,
      color: color
    }));
    this.publish("view", "updateHologramColor", hologramName);
  }

  /**
   * Require to show user manipulation.
   * @param data {Object} object containing the data of the hologram and the view.
   */
  requireShowUserManipulation(data) {
    this.#log("received showUserManipulation");
    this.linkedViews.filter(v => data.view !== v).forEach(v => {
      this.publish(v, "showUserManipulation", {
        hologramName: data.hologramName
      });
    });
  }

  /**
   * Manage the control of the hologram from the user.
   * @param data {Object} object that contains the id of the view in control.
   */
  manageUserHologramControlRequired(data) {
    this.#log("received manage user hologram control");
    this.hologramInUserControl.set(data.hologramName, data.view);
    this.linkedViews.filter(v => data.view !== v).forEach(v => {
      this.publish(v, "freezeControlButton", {
        hologramName: data.hologramName
      });
    });
  }

  /**
   * Manage the release of the control from the user who had it.
   * @param data {Object} object that contains the id of the view where the user released the control.
   */
  manageUserHologramControlReleased(data) {
    this.#log("received manage user hologram control released");
    this.hologramInUserControl.delete(data.hologramName);
    this.linkedViews.filter(v => data.view !== v).forEach(v => {
      this.publish(v, "restoreControlButton", {
        hologramName: data.hologramName
      });
    });
  }

  /**
   * Update the hologram positionSphere1 due to a manipulation.
   * @param data {Object} object containing the data of the hologram.
   */
  updateHologramPositionAfterManipulation(data) {
    this.#log("received requireHologramUpdate");
    const hologramName = data.hologramName;
    const position = new Vector3(data.position_x, data.position_y, data.position_z);
    this.holograms.get(hologramName).position = position;
    infrastructureEventManager.sendEvent("updatePosition", JSON.stringify({
      hologramName: hologramName,
      position: position
    }));
    this.linkedViews.filter(v => data.view !== v).forEach(v => {
      this.publish(v, "showHologramUpdatedPosition", hologramName);
    });
  }

  /**
   * Update the scaling of the hologram due to a manipulation.
   * @param data {Object} object containing the data of the hologram.
   */
  updateHologramScalingAfterManipulation(data) {
    this.#log("received requireHologramUpdate");
    const hologramName = data.hologramName;
    const scaling = new Vector3(data.scale_x, data.scale_y, data.scale_z);
    this.holograms.get(hologramName).scaling = scaling;
    infrastructureEventManager.sendEvent("updateScaling", JSON.stringify({
      hologramName: hologramName,
      scale: scaling
    }));
    this.linkedViews.filter(v => data.view !== v).forEach(v => {
      this.publish(v, "showHologramUpdatedScaling", hologramName);
    });
  }
  #addHologram(hologram) {
    if (!this.holograms.has(hologram.name)) {
      this.holograms.set(hologram.name, hologram);
    }
  }
  #setupViewEventHandlers() {
    this.subscribe("create", "importedHologram", this.addImportedHologram);
    this.subscribe("create", "standardHologram", this.addStandardHologram);
    this.subscribe("updateHologram", "changeColor", this.updateColor);
    this.subscribe("updateHologram", "changeScaling", this.updateScaling);
    this.subscribe("updateHologram", "changePosition", this.updatePosition);
    this.subscribe("updateHologram", "changeRotation", this.updateRotation);
    this.subscribe("hologramManipulator", "showUserManipulation", this.requireShowUserManipulation);
    this.subscribe("hologramManipulation", "positionChanged", this.updateHologramPositionAfterManipulation);
    this.subscribe("hologramManipulation", "scaleChanged", this.updateHologramScalingAfterManipulation);
    this.subscribe("controlButton", "released", this.manageUserHologramControlReleased);
    this.subscribe("controlButton", "clicked", this.manageUserHologramControlRequired);
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("H-MODEL: " + message);
    }
  }
  static types() {
    return {
      "CroquetStandardHologram": StandardHologramClone,
      "CroquetImportedHologram": ImportedHologramClone,
      "Vector3": Vector3,
      "Quaternion": Quaternion
    };
  }
}
HologramModel.register("HologramModel");
export { HologramModel };

/**
 * Class that represents a model for the synchronized variable.
 */
class SynchronizedVariableModel extends Croquet.Model {
  /**
   * Initialize the model
   * @param options {Object} containing the creation options.
   */
  init(options = {}) {
    super.init();
    this.syncrhonizedVariables = new Map();
    this.#setupViewEventHandlers();
  }

  /**
   * Add a synchronized variable.
   * @param data {Object} object containing the data of the variable.
   */
  addVariable(data) {
    const variable = Object.create(SynchronizedVariableClone.prototype, Object.getOwnPropertyDescriptors(data));
    if (!this.syncrhonizedVariables.has(variable.name)) {
      this.syncrhonizedVariables.set(variable.name, variable);
    } else {
      const value = this.syncrhonizedVariables.get(variable.name).value;
      infrastructureEventManager.sendEvent("updateValue", JSON.stringify({
        variableName: variable.name,
        value: value
      }));
    }
  }

  /**
   * Update the value of a synchronized variable.
   * @param data {Object} object containing the data of the variable.
   */
  updateValue(data) {
    const variableName = data.variableName;
    const value = data.value;
    if (this.syncrhonizedVariables.get(variableName).value !== value) {
      this.syncrhonizedVariables.get(variableName).value = value;
      infrastructureEventManager.sendEvent("updateValue", JSON.stringify({
        variableName: variableName,
        value: value
      }));
    }
  }
  #setupViewEventHandlers() {
    this.subscribe("create", "synchronizedVariable", this.addVariable);
    this.subscribe("synchronizedVariable", "valueChange", this.updateValue);
  }
  static types() {
    return {
      "CroquetSynchronizedVariable": SynchronizedVariableClone
    };
  }
}
SynchronizedVariableModel.register("SynchronizedVariableModel");
export { SynchronizedVariableModel };
const MAX_EVENT_FOR_SECOND = 20;
const REFERENCE_TIME_EVENT = 1000;

/**
 * Class that represents a View in charge of handling the rendering aspects of the holograms.
 */
class HologramView extends Croquet.View {
  /**
   * Constructor of the class
   * @param model {Croquet.Model} the model of reference.
   * @param sceneManager {SceneManager} the scene manager of the application.
   */
  constructor(model, sceneManager) {
    super(model);
    this.model = model;
    this.sceneManager = sceneManager;
    this.hologramsManipulatorMenu = new Map();
    this.#setupModelEventHandlers();
  }

  /**
   * Add a menu that allow the user to manipulate a hologram.
   * @param hologramName {String} the name of the hologram.
   * @param menuPosition {Vector3} the positionSphere1 of the menu in space.
   */
  addManipulatorMenu(hologramName, menuPosition) {
    const manipulatorNearMenu = new BABYLON.GUI.NearMenu("NearMenu");
    manipulatorNearMenu.rows = 1;
    this.sceneManager.GUIManager.addControl(manipulatorNearMenu);
    manipulatorNearMenu.isPinned = true;
    manipulatorNearMenu.parent = this.sceneManager.hologramRenders.get(hologramName).mesh;
    manipulatorNearMenu.position = new BABYLON.Vector3(menuPosition._x, menuPosition._y, menuPosition._z);
    const controlButton = new BABYLON.GUI.HolographicButton("manipulate", false);
    manipulatorNearMenu.addButton(controlButton);
    this.#setDefaultControlButtonBehavior(hologramName, controlButton);
    this.hologramsManipulatorMenu.set(hologramName, new Triple(manipulatorNearMenu, controlButton));
  }

  /**
   * Require to show the imported hologram.
   * @param hologramName {String} object containing the data of the hologram.
   */
  showImportedHologram(hologramName) {
    this.sceneManager.addImportedHologram(this.model.holograms.get(hologramName));
  }

  /**
   * Require to show the standard hologram.
   * @param hologramName {String} object containing the data of the hologram.
   */
  showStandardHologram(hologramName) {
    this.sceneManager.addStandardHologram(this.model.holograms.get(hologramName));
  }

  /**
   * Require to show the manipulation of the hologram
   * @param data {Object} object containing the hologram data.
   */
  showUserManipulation(data) {
    this.#log("received show userManipulation " + data.hologramName);
    const hologramName = data.hologramName;
    const hologramRender = this.sceneManager.hologramRenders.get(hologramName);
    hologramRender.showOtherUserManipulation();
  }

  /**
   * Require to show the updated positionSphere1 of the hologram.
   * @param hologramName {String} the hologram name.
   */
  showHologramUpdatedPosition(hologramName) {
    const newPosition = this.model.holograms.get(hologramName).position;
    this.sceneManager.hologramRenders.get(hologramName).updatePosition(newPosition);
  }

  /**
   * Require to show the updated rotationSphere1 of the hologram.
   * @param hologramName {String} the hologram name.
   */
  showHologramUpdatedRotation(hologramName) {
    const newRotation = this.model.holograms.get(hologramName).rotation;
    this.sceneManager.hologramRenders.get(hologramName).updateRotation(newRotation);
  }

  /**
   * Require to show the updated scale of the hologram.
   * @param hologramName {String} the hologram name.
   */
  showHologramUpdatedScaling(hologramName) {
    const newScaling = this.model.holograms.get(hologramName).scaling;
    this.sceneManager.hologramRenders.get(hologramName).updateScaling(newScaling);
  }

  /**
   * Require to show the updated colorSphere of the hologram.
   * @param hologramName {String} the hologram name.
   */
  showHologramUpdatedColor(hologramName) {
    this.#log("received updateHologramColor");
    this.sceneManager.hologramRenders.get(hologramName).updateColor(this.model.holograms.get(hologramName).color);
  }

  /**
   * Make the control button no more clickable.
   * @param data {Object} object containing the data related to the hologram of reference.
   */
  freezeControlButton(data) {
    this.#log("received freezeControlButton hologram " + data.hologramName);
    const hologramName = data.hologramName;
    const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
    this.#setOtherUserInControlBehaviorControlButton(hologramControls.y);
  }

  /**
   * Restore the normal behaviour of the control button.
   * @param data {Object} object containing the data related to the hologram of reference.
   */
  restoreControlButton(data) {
    this.#log("received restore ControlButton hologram " + data.hologramName);
    const hologramName = data.hologramName;
    const hologramControls = this.hologramsManipulatorMenu.get(hologramName);
    this.sceneManager.hologramRenders.get(hologramName).removeHologramManipulator();
    this.#setDefaultControlButtonBehavior(data.hologramName, hologramControls.y);
  }
  #setOtherUserInControlBehaviorControlButton(controlButton) {
    controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
    controlButton.frontMaterial.albedoColor = BABYLON.Color3.Red();
    controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.67, 0.29, 0.29);
    controlButton.imageUrl = "../../img/IconClose.png";
    controlButton.onPointerDownObservable.clear();
  }
  #notifyUserStartManipulating(hologramName) {
    this.#log("user start manipulating hologram " + hologramName);
    this.publish("controlButton", "clicked", {
      view: this.viewId,
      hologramName: hologramName
    });
  }
  #notifyCurrentUserReleaseControl(hologramName) {
    this.#log("user stop manipulating");
    this.publish("controlButton", "released", {
      view: this.viewId,
      hologramName: hologramName
    });
  }
  #setDefaultControlButtonBehavior(hologramName, controlButton) {
    controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
    controlButton.frontMaterial.albedoColor = BABYLON.Color3.Blue();
    controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.37, 0.67);
    controlButton.text = "Manipulate";
    controlButton.imageUrl = "../../img/IconAdjust.png";
    controlButton.onPointerDownObservable.clear();
    controlButton.onPointerDownObservable.add(() => {
      this.#log("clicked");
      this.#notifyUserStartManipulating(hologramName);
      const hologramRender = this.sceneManager.hologramRenders.get(hologramName);
      hologramRender.addHologramManipulator();
      let eventCount = 0;
      this.timeElapsed = false;
      let isClockSet = false;
      hologramRender.sixDofDragBehavior.onPositionChangedObservable.add(() => {
        eventCount += 1;
        if (!isClockSet) {
          this.future(REFERENCE_TIME_EVENT).clockEventTick();
          isClockSet = true;
        }
        if (eventCount < MAX_EVENT_FOR_SECOND && !this.timeElapsed) {
          this.publish("hologramManipulation", "positionChanged", this.#serializeDataPosition(hologramName, hologramRender));
        } else if (this.timeElapsed) {
          isClockSet = false;
          this.timeElapsed = false;
          eventCount = 0;
        }
      });
      hologramRender.gizmo.onScaleBoxDragObservable.add(() => {
        this.publish("hologramManipulation", "scaleChanged", this.#serializeDataScale(hologramName, hologramRender));
      });
      this.#setManipulatingBehaviourControlButton(hologramName, controlButton);
      this.publish("hologramManipulator", "showUserManipulation", {
        view: this.viewId,
        hologramName: hologramName
      });
    });
  }

  /**
   * Set a tick for sending event. Is better to send only 20 events for seconds.
   */
  clockEventTick() {
    this.timeElapsed = true;
  }
  #serializeDataPosition(hologramName, hologramRender) {
    const absolutePosition = hologramRender.boundingBox.absolutePosition;
    return {
      hologramName: hologramName,
      view: this.viewId,
      position_x: absolutePosition.x,
      position_y: absolutePosition.y,
      position_z: absolutePosition.z
    };
  }
  #serializeDataScale(hologramName, hologramRender) {
    const absoluteScaling = hologramRender.boundingBox.absoluteScaling;
    return {
      hologramName: hologramName,
      view: this.viewId,
      scale_x: absoluteScaling.x,
      scale_y: absoluteScaling.y,
      scale_z: absoluteScaling.z
    };
  }
  #setManipulatingBehaviourControlButton(hologramName, controlButton) {
    controlButton.text = "Stop manipulating";
    controlButton.frontMaterial.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
    controlButton.frontMaterial.albedoColor = BABYLON.Color3.Green();
    controlButton.backMaterial.albedoColor = new BABYLON.Color3(0.29, 0.67, 0.45);
    controlButton.onPointerDownObservable.clear();
    controlButton.onPointerDownObservable.add(() => {
      this.#notifyCurrentUserReleaseControl(hologramName);
      this.sceneManager.hologramRenders.get(hologramName).removeHologramManipulator();
      this.#setDefaultControlButtonBehavior(hologramName, controlButton);
    });
  }
  showCurrentManipulation() {
    this.model.hologramInUserControl.forEach((v, k) => {
      this.sceneManager.hologramRenders.get(k).showOtherUserManipulation();
      this.freezeControlButton({
        hologramName: k
      });
    });
  }
  #setupModelEventHandlers() {
    this.subscribe(this.viewId, "freezeControlButton", this.freezeControlButton);
    this.subscribe(this.viewId, "restoreControlButton", this.restoreControlButton);
    this.subscribe(this.viewId, "showUserManipulation", this.showUserManipulation);
    this.subscribe(this.viewId, "showHologramUpdatedPosition", this.showHologramUpdatedPosition);
    this.subscribe(this.viewId, "showHologramUpdatedScaling", this.showHologramUpdatedScaling);
    this.subscribe(this.viewId, "showImportedHologram", this.showImportedHologram);
    this.subscribe(this.viewId, "showStandardHologram", this.showStandardHologram);
    this.subscribe("view", "updateHologramColor", this.showHologramUpdatedColor);
    this.subscribe("view", "updateHologramScaling", this.showHologramUpdatedScaling);
    this.subscribe("view", "updateHologramPosition", this.showHologramUpdatedPosition);
    this.subscribe("view", "updateHologramRotation", this.showHologramUpdatedRotation);
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("H-VIEW: " + message);
    }
  }
}
export { HologramView };

/**
 * Class that represents the root view of the application
 */
class RootView extends Croquet.View {
  /**
   * Constructor for the class.
   * @param model {Croquet.Model}  the model of reference
   */
  constructor(model) {
    super(model);
    this.model = model;
    this.sceneManager = new SceneManager();
    this.hologramView = new HologramView(this.model.hologramModel, this.sceneManager);
    infrastructureEventManager.setRootView(this);
    this.#checkFirstViewInCharge();
    this.#setupModelEventHandlers();
    infrastructureEventManager.listenForCoreEvents();
  }

  /**
   * Initialize the WebXR scene.
   */
  initializeScene() {
    const renderCanvas = document.createElement('canvas');
    renderCanvas.setAttribute("id", "renderCanvas");
    renderCanvas.setAttribute("style", "width: 100%; height: 100%");
    document.body.appendChild(renderCanvas);
    this.sceneManager.initializeScene();
  }

  /**
   * Run the render loop.
   */
  runRenderLoop() {
    this.hologramView.showCurrentManipulation();
    this.sceneManager.activateRenderLoop();
  }

  /**
   * Notify a specific event to the Model.
   * @param event {String} the name of the event.
   * @param message {String} the message to send.
   * @param data {Object} the data to send.
   */
  notifyEventToModel(event, message, data) {
    this.publish(event, message, data);
  }

  /**
   * Add a near menu to the scene.
   * @param menuRows {Number} the number of rows in which the menu is organized.
   * @param menuPosition {Vector3} the positionSphere1 of the menu in space.
   * @param buttonList {[Button]} the list of button that compose the menu.
   */
  addNearMenu(menuRows, menuPosition, buttonList) {
    const holographicButtonList = this.sceneManager.addNearMenu(menuPosition, menuRows, buttonList);
    holographicButtonList.forEach(button => {
      button.onPointerDownObservable.add(() => {
        eventBus.emit(button.name, "");
      });
    });
  }

  /**
   * Propagate the tick received form the model.
   * @param animationName {String} the name of the animation to be updated.
   */
  propagateTick(animationName) {
    infrastructureEventManager.sendEvent(animationName, "");
  }

  /**
   * Require the backend to set the update for the element.
   */
  setElementUpdate() {
    this.#log("received setUpdate");
    infrastructureEventManager.sendEvent("setUpdate", "");
  }
  #checkFirstViewInCharge() {
    if (this.model.linkedViews.length === 1) {
      this.#log("set view in charge");
      this.publish("view", "viewInCharge", this.viewId);
      this.setElementUpdate();
    }
  }
  #setupModelEventHandlers() {
    this.subscribe(this.viewId, "setUpdate", this.setElementUpdate);
    this.subscribe("view", "animationTick", this.propagateTick);
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("VIEW: " + message);
    }
  }
}
export { RootView };

/**
 * Class that represent a Hologram that can be used in the croquet model.
 */
class HologramClone {
  /**
   * Constructor of the class.
   * @param name {String} the name of the hologram.
   * @param position {Vector3} the positionSphere1 of the hologram in the world.
   * @param rotation {Quaternion} the rotationSphere1 of the hologram.
   * @param scaling {Vector3} the scal eof the hologram.
   */
  constructor(name, position, rotation, scaling) {
    this._name = name;
    this._position = position;
    this._rotation = rotation;
    this._scaling = scaling;
  }

  /**
   * Get the name of the hologram.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the positionSphere1 of the hologram.
   * @returns {Vector3}
   */
  get position() {
    return this._position;
  }

  /**
   * Get the rotationSphere1 of the hologram.
   * @returns {Quaternion}
   */
  get rotation() {
    return this._rotation;
  }

  /**
   * Get the scaling of the hologram.
   * @returns {Vector3}
   */
  get scaling() {
    return this._scaling;
  }

  /**
   * Set the name of the hologram.
   * @param value {String} the new name to assign.
   */
  set name(value) {
    this._name = value;
  }

  /**
   * Set the positionSphere1 of the hologram.
   * @param value the new positionSphere1.
   */
  set position(value) {
    this._position = value;
  }

  /**
   * Set the rotationSphere1 of the hologram.
   * @param value the new rotationSphere1.
   */
  set rotation(value) {
    this._rotation = value;
  }

  /**
   * Set the scaling of the hologram.
   * @param value the new scaling.
   */
  set scaling(value) {
    this._scaling = value;
  }
}
export { HologramClone };

/**
 * Class that represents an imported hologram associated with a file that adjusts its
 * graphical rendering, that can be used in Croquet model.
 */
class ImportedHologramClone extends HologramClone {
  /**
   * Constructor of the class.
   * @param name {String} the name of the hologram.
   * @param meshFilePath {String} the file path for the rendering process.
   * @param position {Vector3} the positionSphere1 of the hologram.
   * @param rotation {Quaternion} the rotationSphere1 of the hologram.
   * @param scaling {Vector3} the scaling of the hologram
   */
  constructor(name, meshFilePath, position, rotation, scaling) {
    super(name, position, rotation, scaling);
    this._meshFilePath = meshFilePath;
  }

  /**
   * Get the file path for teh rendering process.
   * @returns {String}
   */
  get meshFilePath() {
    return this._meshFilePath;
  }
}
export { ImportedHologramClone };

/**
 * Class representing a standard hologram created from a specific shape, that can be used in Croquet model.
 */
class StandardHologramClone extends HologramClone {
  /**
   * Constructor of the class.
   * @param name {String} the name of the class.
   * @param shapeName {StandardShape} the shape of reference.
   * @param creationOptions {Object} the creation options related to the shape.
   * @param position {Vector3} the hologram positionSphere1.
   * @param rotation {Quaternion} the hologram rotationSphere1.
   * @param color {String} the hologramColor.
   */
  constructor(name, shapeName, creationOptions, position, rotation, color) {
    super(name, position, rotation, null);
    this._creationOptions = creationOptions;
    this._shapeName = shapeName;
    this._color = color;
  }

  /**
   * Get shape name.
   * @returns {StandardShape}
   */
  get shapeName() {
    return this._shapeName;
  }

  /**
   * Get creation options.
   * @returns {Object}
   */
  get creationOptions() {
    return this._creationOptions;
  }

  /**
   * Get the colorSphere of the hologram.
   * @returns {String}
   */
  get color() {
    return this._color;
  }

  /**
   * Set the colorSphere of the hologram.
   * @param value the new colorSphere.
   */
  set color(value) {
    this._color = value;
  }
}
export { StandardHologramClone };

/**
 * Class representing a synchronized variable to use in the Croquet Model.
 */
class SynchronizedVariableClone {
  /**
   * Constructor of the class.
   * @param name {String} the name of the variable.
   * @param value the value to assign.
   */
  constructor(name, value) {
    this._name = name;
    this._value = value;
  }

  /**
   * Get the name of the variable.
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * Get the value of the variable.
   * @returns {*}
   */
  get value() {
    return this._value;
  }

  /**
   * Set the value of the variable.
   * @param value
   */
  set value(value) {
    this._value = value;
  }
}
export { SynchronizedVariableClone };

/**
 * Class responsible to manage the event related to the infrastructure part.
 */
class InfrastructureEventManager {
  /**
   * Empty constructor of the class.
   */
  constructor() {
    this.view = null;
  }

  /**
   * Send a new event to the core part.
   * @param event {String} the name of the event.
   * @param data {String} the data to send.
   */
  sendEvent(event, data) {
    eventBus.emit(event, data);
  }

  /**
   * Set the root view of reference.
   * @param rootView {Croquet.View} the root view of the application.
   */
  setRootView(rootView) {
    this.view = rootView;
  }

  /**
   * Listen for specific event from the core part.
   */
  listenForCoreEvents() {
    eventBus.on("initialize", () => {
      this.#log("initialize scene");
      this.view.initializeScene();
    });
    eventBus.on("render", () => {
      this.#log("run render loop");
      this.view.runRenderLoop();
    });
    eventBus.on("createImportedHologram", data => {
      this.#log("create imported hologram");
      this.view.notifyEventToModel("create", "importedHologram", {
        view: this.view.viewId,
        hologram: JSON.parse(data)
      });
    });
    eventBus.on("createStandardHologram", data => {
      this.#log("create standard hologram");
      this.view.notifyEventToModel("create", "standardHologram", {
        view: this.view.viewId,
        hologram: JSON.parse(data)
      });
    });
    eventBus.on("createSynchronizedVariable", data => {
      this.#log("create synchronized variable");
      this.view.notifyEventToModel("create", "synchronizedVariable", JSON.parse(data));
    });
    eventBus.on("addManipulatorMenu", data => {
      this.#log("add manipulator menu");
      const object = JSON.parse(data);
      const hologramName = object.name;
      const menuPosition = object.position;
      this.view.hologramView.addManipulatorMenu(hologramName, menuPosition);
    });
    eventBus.on("addNearMenu", data => {
      this.#log("add near menu");
      const object = JSON.parse(data);
      const menuRows = object._rows;
      const menuPosition = object._position;
      const buttonList = object.buttonList;
      this.view.addNearMenu(menuRows, menuPosition, buttonList);
    });
    eventBus.on("newAnimation", data => {
      this.#log("add animation");
      this.view.notifyEventToModel("animation", "createAnimation", JSON.parse(data));
    });
    eventBus.on("stopAnimation", data => {
      this.#log("stop animation");
      this.view.notifyEventToModel("animation", "stopAnimation", JSON.parse(data));
    });
    eventBus.on("valueChange", data => {
      this.view.notifyEventToModel("synchronizedVariable", "valueChange", JSON.parse(data));
    });
    eventBus.on("colorChange", data => {
      this.view.notifyEventToModel("updateHologram", "changeColor", JSON.parse(data));
    });
    eventBus.on("scalingChange", data => {
      this.view.notifyEventToModel("updateHologram", "changeScaling", JSON.parse(data));
    });
    eventBus.on("positionChange", data => {
      this.view.notifyEventToModel("updateHologram", "changePosition", JSON.parse(data));
    });
    eventBus.on("rotationChange", data => {
      this.view.notifyEventToModel("updateHologram", "changeColor", JSON.parse(data));
    });
  }
  #log(message) {
    const debug = false;
    if (debug) {
      console.log("I-EVENT: " + message);
    }
  }
}
const infrastructureEventManager = new InfrastructureEventManager();
export { infrastructureEventManager };
/**
 * Utility class that represent a quaternion.
 */
class Quaternion {
  /**
   * Constructor of the class.
   * @param x {Number} the value for the first variable.
   * @param y {Number} the value for the second variable.
   * @param z {Number} the value for the third variable.
   * @param w {Number} the value for the fourth variable.
   */
  constructor(x, y, z, w) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  /**
   * Get the cx of the quaternion.
   * @returns {Number}
   */
  get x() {
    return this._x;
  }

  /**
   * Get the y of the quaternion.
   * @returns {Number}
   */
  get y() {
    return this._y;
  }

  /**
   * Get the z of the quaternion
   * @returns {Number}
   */
  get z() {
    return this._z;
  }

  /**
   * Get the w of the quaternion.
   * @returns {Number}
   */
  get w() {
    return this._w;
  }
}
export { Quaternion };
/**
 * Utility class that represent a Triple.
 */
class Triple {
  /**
   * Constructor of the class
   * @param x the value of the x variable.
   * @param y the value of the y variable.
   * @param z the value of the z variable.
   */
  constructor(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  /**
   * Get the x of the triple.
   * @returns {*}
   */
  get x() {
    return this._x;
  }

  /**
   * Get the y of the triple.
   * @returns {*}
   */
  get y() {
    return this._y;
  }

  /**
   * Get the z of the triple
   * @returns {*}
   */
  get z() {
    return this._z;
  }
}
export { Triple };
/**
 * Utility class that represent a vector of three element.
 */
class Vector3 {
  /**
   * Constructor of the class
   * @param x {Number} the value of the x variable.
   * @param y {Number} the value of the y variable.
   * @param z {Number} the value of the z variable.
   */
  constructor(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  /**
   * Get the x of the vector.
   * @returns {Number}
   */
  get x() {
    return this._x;
  }

  /**
   * Get the y of the vector.
   * @returns {Number}
   */
  get y() {
    return this._y;
  }

  /**
   * Get the z of the vector.
   * @returns {Number}
   */
  get z() {
    return this._z;
  }
}
export { Vector3 };
