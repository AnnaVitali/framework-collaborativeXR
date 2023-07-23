# CollaborativeXR - Framework

This repository contains an experimental framework for the realization of shared experiences of eXtended Reality.

## Dependencies

The dependencies that the framework presents are reported in the following table.

| Technology      | Dependency |
|-----------------|-|
| Croquet.os      | https://cdn.jsdelivr.net/npm/@croquet/croquet@1.0.5 |
| Babylon.js      | https://cdn.babylonjs.com/babylon.js                |
| Babylon.gui     | https://preview.babylonjs.com/gui/babylon.gui.min.js      |
| Babylon.loaders | https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js|
|                 |                                                           |

## Usage

Inside the `index.html` file there is an initial template with which start to write your applications, of which the main part is reported below.

1. First you need to get an apikey is an appid through the portal of Croquet (https://croquet.io/account/)
2. Start a session
3. Initialize the scene
4. Create and define the helmet properties you want within the scene
5. Activate the render loop

```javascript
    const apiKey =  'yourApiKey';
    const appId = 'yourAppId';

    const sessionManager = new SessionManager();
    await sessionManager.startSession(apiKey, appId);
    const scene = new Scene(sessionManager);
    scene.initializeScene();

    //here the code of your application

    scene.activateRenderLoop();
```

## Example

Moving on the _example_ branch, you will have the opportunity to see some application examples made through the framework.

### Simple Animation

Inside the file `example_animation.html`, you can find out how to create simple holograms and associate them with an animation that is started and stopped via a menu.

![Alt Text](gif/animation.gif)

### Hologram Manipulation

Inside the file `example_robot.html` you can find out how to import holograms defined by a file in `.gltf` format, and how to associate to them a manipulator menu that allows you to move and scale them.

![Alt Text](gif/robot.gif)

### Simple Application

Inside the file `example_animal.html` you can find out how to make a simple application consisting of both imported holograms and simple holograms, allow their manipulation, and create GUI for user interaction.

![Alt Text](gif/animal.gif)
