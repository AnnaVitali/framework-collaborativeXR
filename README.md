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

## How to run the examples

To see the results use the server pre-set in the file `app.js` setting the **ip** address and the reference **port**, then
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

## Examples

In this branch you can experiment with a series of examples that show the functionality of the framework.

### Simple Animation

Inside the file `example_animation.html`, you can find out how to create simple holograms and associate them with an animation that is started and stopped via a menu.

![Alt Text](gif/animation.gif)

### Hologram Manipulation

Inside the file `example_robot.html` you can find out how to import holograms defined by a file in `.gltf` format, and how to associate to them a manipulator menu that allows you to move and scale them.

![Alt Text](gif/robot.gif)

### Simple Application

Inside the file `example_animal.html` you can find out how to make a simple application consisting of both imported holograms and simple holograms, allow their manipulation, and create GUI for user interaction.

![Alt Text](gif/animal.gif)