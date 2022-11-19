// Required by Webpack - do not touch
import * as THREE from "three";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls"; //https://threejs.org/docs/#examples/en/controls/FirstPersonControls.handleResize

// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Mathieu Lebaron and Alex Christensen"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else
// TODO
const clock = new THREE.Clock();

let canvas = document.querySelector('#webgl-scene')
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({canvas})
let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.setClearColor(0xFFEEEE)

let axes = new THREE.AxesHelper(10)
scene.add(axes)

let controls = {
    ambient: true,
    directional: false,
    point: false,
    spotlight: false,
    material: 'basic',
    intensity: 1.5,
    spotlight_target: 'scene'
}

camera.position.set(0, 10, 0)
camera.rotation.set(0, 0, 0)

let cameraControls = new FirstPersonControls(camera, renderer.domElement);
cameraControls.movementSpeed = 150;
cameraControls.lookSpeed = 0.1;

cameraControls.onkeydown = function(e){
    let t = cameraControls.object
    switch(e.code){
        case 'KeyW': // forward
            t.translateX(5)
            console.log('forward')
            console.log(t.position, t.rotation)
            break;
        case 'KeyS': // back
            t.translateX(-5)
            console.log('back')
            // t.position.set(t.x - 5, t.y, t.z)
            break;
        case 'KeyA': // left
            t.translateZ(5)
            console.log('left')
            break;
        case 'ArrowRight': // right
            t.rotateY(5)
            console.log('right')
            break;
        case 'ArrowLeft': // forward
            t.rotateY(-5)
            console.log('forward')
            break;
    }
}
cameraControls.lookVertical = false

// Loading textures
let texLoader = new THREE.TextureLoader()
let textures = {
    floor: texLoader.load('./images/Stone Floor Texture.png', function () {
        renderer.render(scene, camera)
    }),
    wall: texLoader.load('./images/Stone Wall Texture.jpg', function () {
        renderer.render(scene, camera)
    })
}

// Adding a plane (floor)
let geometry = new THREE.PlaneGeometry(200, 200)
let material = new THREE.MeshPhongMaterial({color: 0x70695e})
let mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(-Math.PI / 2)
mesh.translateZ(-100)
mesh.material.map = textures['floor']
scene.add(mesh)

// Adding a plane (wall Right)
geometry = new THREE.PlaneGeometry(200, 200)
material = new THREE.MeshPhongMaterial({color: 0x9c9283})
mesh = new THREE.Mesh(geometry, material)
mesh.rotateY(-Math.PI / 2)
mesh.translateZ(-100)
mesh.material.map = textures['wall']
scene.add(mesh)

// Add light sources
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
let directionalLight = new THREE.DirectionalLight(0xFFFFFF)
let pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(0, 100, 0)
let spotLight = new THREE.SpotLight(0xFFFFFF)
spotLight.position.set(100, 150, 100)

function animate() {
    if(controls.material === "Lambert")
    {
        for(let obj of scene.children)
        {
            if(obj.materialParams !== undefined)
            {
                obj.material = new THREE.MeshLambertMaterial(obj.materialParams)
            }
        }
    }
    else if(controls.material === "Phong")
    {
        for(let obj of scene.children)
        {
            if(obj.materialParams !== undefined)
            {
                obj.material = new THREE.MeshPhongMaterial(obj.materialParams)
            }
        }
    }
    else
    {
        for(let obj of scene.children)
        {
            if(obj.materialParams !== undefined)
            {
                obj.material = new THREE.MeshBasicMaterial(obj.materialParams)
            }
        }
    }

    if(controls.ambient)
    {
        ambientLight.intensity = controls.intensity
        scene.add(ambientLight)
    }
    else
    {
        scene.remove(ambientLight)
    }

    if(controls.directional)
    {
        directionalLight.intensity = controls.intensity
        scene.add(directionalLight)
    }
    else
    {
        scene.remove(directionalLight)
    }

    if(controls.point)
    {
        pointLight.intensity = controls.intensity
        scene.add(pointLight)
    }
    else
    {
        scene.remove(pointLight)
    }

    if(controls.spotlight)
    {
        spotLight.intensity = controls.intensity
        spotLight.target = scene
        scene.add(spotLight)
    }
    else
    {
        scene.remove(spotLight)
    }

    requestAnimationFrame( animate );
    cameraControls.update( clock.getDelta() );
    renderer.render( scene, camera );
}
animate()