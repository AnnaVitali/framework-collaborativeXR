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

## Template

Inside the `src/html/template.html` file there is an initial template with which start to write your applications, of which the main part is reported below.

1. First you need to get an apikey is an appid through the portal of Croquet (https://croquet.io/account/)
2. Start a session
3. Initialize the scene
4. Create and define the helmet properties you want within the scene
5. Activate the render loop

```javascript
    import * as CollaborativeXR from "../collaborativeXR.min.js"

    const apiKey =  'yourApiKey';
    const appId = 'yourAppId';
    
    const sessionManager = new CollaborativeXR.SessionManager();
    await sessionManager.startSession(apiKey, appId);
    const scene = new CollaborativeXR.Scene(sessionManager);
    scene.initializeScene();
    
    //here the code of your application
    
    scene.activateRenderLoop();
```

To see the results use the server pre-set in the file `app.js` setting the *ip* address and the reference *port*, then 
execute these commands for generating a certificate to be assigned to the site.

```bash
openssl genrsa -out private_key.pem
```
```bash
openssl req -new -key private_key.pem -out csr.pem
```
```bash
openssl x509 -req -days 9999 -in csr.pem -signkey private_key.pem -out cert.pem
```

Once you have created the certificate you can launch the application by running the following commands:
```bash
npm init
```
```bash
npm install express
```
```bash
node app.js
```