# CollaborativeXR - Framework

This repository contains an experimental framework for the realization of shared experiences in eXtended Reality.

## Dependencies

The dependencies that the framework presents are reported in the following table.

| Technology      | Dependency |
|-----------------|-|
| Croquet.os      | https://cdn.jsdelivr.net/npm/@croquet/croquet@1.0.5 |
| Babylon.js      | https://cdn.babylonjs.com/babylon.js                |
| Babylon.gui     | https://preview.babylonjs.com/gui/babylon.gui.min.js      |
| Babylon.loaders | https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js|
|                 |                                                           |

## Application template

Moving to the branch [_applicationTemplate_](https://github.com/AnnaVitali/framework-collaborativeXR/blob/applicationTemplate/README.md) inside the `src/html/template.html` file there is an initial template by which you can start to write your applications. The main part is reported below.

1. Get an _apiKey_ and an _appId_ through the portal of Croquet (https://croquet.io/account/)
2. Start a session
3. Initialize the scene
4. Create and define the elements properties you want within the scene
5. Activate the render loop

```javascript
        import * as CollaborativeXR from "../../collaborativeXR.min.js"

        const apiKey =  'yourApiKey';
        const appId = 'yourAppId';
        
        const sessionManager = new CollaborativeXR.SessionManager();
        await sessionManager.startSession(apiKey, appId);
        const scene = new CollaborativeXR.Scene(sessionManager);
        scene.initializeScene();
        
        //here the code of your application
        
        scene.activateRenderLoop();
```

## Example

Moving on the [_example_](https://github.com/AnnaVitali/framework-collaborativeXR/blob/example/README.md) branch, you will have the opportunity to see some application examples made through the framework.

### Simple Animation

Inside the file `src/html/example_animation.html`, you can find out how to create simple holograms and associate them with an animation that is started and stopped via a menu.

![Alt Text](gif/animation.gif)

### Hologram Manipulation

Inside the file `src/html/example_robot.html` you can find out how to import holograms defined by a file in `.gltf` format, and how to associate to them a manipulator menu that allows you to move and scale them.

![Alt Text](gif/robot.gif)

### Simple Application

Inside the file `src/html/example_animal.html` you can find out how to make a simple application consisting of both imported holograms and simple holograms, allow their manipulation, and create GUI for user interaction.

![Alt Text](gif/animal.gif)
