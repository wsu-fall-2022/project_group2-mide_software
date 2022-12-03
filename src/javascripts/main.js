// Required by Webpack - do not touch
import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {BallProjectile} from "./projectile";
import {AnimationClip, AnimationMixer, NumberKeyframeTrack, VectorKeyframeTrack} from "three";

// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Mathieu Lebaron and Alex Christensen"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else
// TODO

let canvas = document.querySelector('#webgl-scene')
export let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({canvas})
let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 10000)

//player
let player;
let updatables = []
//list of things that player can collide with
let collidableMeshList = [];

renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.setClearColor(0xFFEEEE)

let axes = new THREE.AxesHelper(10)
scene.add(axes)

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let playerDefaultSpeed = 4;
let playerRunSpeed = 6.5;
let playerSpeed = playerDefaultSpeed;
let selectedWeapon = 2;
let gunMesh;

let controls = {
    ambient: true,
    directional: false,
    point: false,
    spotlight: false,
    material: 'basic',
    intensity: 1.5,
    spotlight_target: 'scene'
}

//player hitbox
camera.position.set(0, 10, 0)
camera.rotation.set(0, 0, 0)
let cubeGeometry = new THREE.CubeGeometry(50,50,50,1,1,1);
let wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000} );
player = new THREE.Mesh( cubeGeometry, wireMaterial );
player.position.set(camera.position.x,camera.position.y,camera.position.z)
scene.add( player );

//player controls
let playerControls = new PointerLockControls(camera, renderer.domElement)
scene.add( playerControls.getObject() );
playerControls.onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'KeyR':
        case 'Space':
            selectedWeapon += 1;
            camera.remove(gunMesh)
            loadGun()

            console.log(selectedWeapon)
            break;

        case 'ShiftLeft':
            playerSpeed = playerRunSpeed;
            break;
    }
}
playerControls.onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

        case 'ShiftLeft':
            playerSpeed = playerDefaultSpeed;
            break;

    }
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//click controls
window.addEventListener( 'click', function () {
    if (playerControls.isLocked === true) {
        fireGun()
    }

} );
canvas.addEventListener( 'click', function () {
    playerControls.lock();

} );

//other listeners
window.addEventListener( 'keydown', playerControls.onKeyDown );
window.addEventListener( 'keyup', playerControls.onKeyUp );
window.addEventListener( 'resize', onWindowResize );

// Loading textures
let texLoader = new THREE.TextureLoader()
export let textures = {
    floor: texLoader.load('./images/Stone Floor Texture.png', function (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10)
        renderer.render(scene, camera)
    }),
    wall: texLoader.load('./images/Stone Wall Texture.jpg', function () {
        renderer.render(scene, camera)
    }),
    shotgun: texLoader.load('./images/Shotgun Barrel Texture.jpg', function () {
        renderer.render(scene, camera)
    }),
    BFGball1: texLoader.load('./images/Lightning Texture.png', function () {
        renderer.render(scene, camera)
    }),
    BFGball2: texLoader.load('./images/Electricity texture 4.png', function () {
        renderer.render(scene, camera)
    }),
    BFGgun: texLoader.load('./images/BFG Texture.jpg', function (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(7, 3.15)
        renderer.render(scene, camera)
    })
}

// Adding a plane (floor)
let geometry = new THREE.PlaneGeometry(2000, 2000)
let material = new THREE.MeshPhongMaterial({color: 0x70695e})
let mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(-Math.PI / 2)
mesh.translateZ(-100)
mesh.material.map = textures['floor']
scene.add(mesh)

// Adding a plane (wall Right)
geometry = new THREE.BoxGeometry(200, 200,0)
material = new THREE.MeshPhongMaterial({color: 0x9c9283})
mesh = new THREE.Mesh(geometry, material)
mesh.rotateY(-Math.PI / 2)
mesh.translateZ(-100)
mesh.material.map = textures['wall']
scene.add(mesh)

collidableMeshList.push(mesh) //Adding to list of things that player can collide with

//second side of wall
let wallback = mesh.clone()
wallback.rotateY(Math.PI)
scene.add(wallback)
collidableMeshList.push(wallback)

function loadGun()
{
    if (selectedWeapon === 3)
    {
        selectedWeapon = 1
    }

    if (selectedWeapon === 1){
        // shotgun
        geometry = new THREE.CylinderGeometry(0.2, 1,40, 30, 30)
        material = new THREE.MeshPhongMaterial({color: 0x555555})
        gunMesh = new THREE.Mesh(geometry, material)
        gunMesh.translateY(-2)
        gunMesh.translateZ(5)
        gunMesh.rotateX(-Math.PI/1.9)
        gunMesh.rotateY(-Math.PI/2)
        gunMesh.material.map = textures['shotgun']
        camera.add(gunMesh)
    }
    else if (selectedWeapon === 2){
        // BFG 9000
        geometry = new THREE.CylinderGeometry(1.5, 0.1,40, 30, 30)
        material = new THREE.MeshPhongMaterial({color: 0x999999})
        gunMesh = new THREE.Mesh(geometry, material)
        gunMesh.translateY(-2.5)
        gunMesh.translateZ(5)
        gunMesh.rotateX(-Math.PI/1.9)
        gunMesh.rotateY(Math.PI)
        gunMesh.material.map = textures['BFGgun']
        camera.add(gunMesh)
    }}
loadGun()

function fireGun() {
    if (selectedWeapon === 1) {
        console.log('Wheres the demon shattering Kaboom?')
    }
    else if (selectedWeapon === 2) {
        let ballProjectile = new BallProjectile()

        //spawns the ball in front of the camera
        let relativePositionVector = new THREE.Vector3(0, -15, -75).applyQuaternion(camera.quaternion)
        ballProjectile.BFGballMesh.quaternion.copy(camera.quaternion)
        ballProjectile.BFGballMesh.position.copy(camera.position).add(relativePositionVector)

        //moves the BFGball forward using a bunch of animation libraries.
        let ballEndPointVector = new THREE.Vector3(0, 0, -2000).applyQuaternion(ballProjectile.BFGballMesh.quaternion)
        let times = [0, 1]
        let positions = [ballProjectile.BFGballMesh.position, ballEndPointVector]
        let positionKeyFrame = new VectorKeyframeTrack(".position", times, positions)
        let positionAnimation = new AnimationClip("positionAnimation", 100, [positionKeyFrame])

        let BFGmixer = new AnimationMixer(ballProjectile.BFGballMesh)
        let action = BFGmixer.clipAction(positionAnimation);
        action.play()

        ballProjectile.BFGballMesh.tick = (delta) => BFGmixer.update(delta)
        updatables.push(ballProjectile.BFGballMesh)

        console.log('Vzoom!')
    }
}

//Level Model
let mtl_file = './Models/Level/doom_E1M1.mtl';
let obj_file = './Models/Level/doom_E1M1.obj';

let mtlLoader = new MTLLoader();
mtlLoader.load(mtl_file,
    function(materials){

        materials.preload()

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials)
        objLoader.load(
            obj_file,
            function (object){
                object.name = 'level'
                scene.add(object);
                collidableMeshList.push(object)
            });
    });

// Add light sources
let ambientLight = new THREE.AmbientLight(0xFFFFFF)
let directionalLight = new THREE.DirectionalLight(0xFFFFFF)
let pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(0, 100, 0)
let spotLight = new THREE.SpotLight(0xFFFFFF)
spotLight.position.set(100, 150, 100)

function animate() {
    function lights(){
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
    } lights()

    if (moveForward === true){
        playerControls.moveForward(playerSpeed)
    }
    if (moveBackward === true){
        playerControls.moveForward(-playerSpeed)
    }
    if (moveLeft === true){
        playerControls.moveRight(-playerSpeed/2)
    }
    if (moveRight === true){
        playerControls.moveRight(playerSpeed/2)
    }

    player.position.set(camera.position.x,camera.position.y,camera.position.z)
    let originPoint = player.position.clone();
    for (let vertexIndex = 0; vertexIndex < player.geometry.vertices.length; vertexIndex++)
    {
        let localVertex = player.geometry.vertices[vertexIndex].clone();
        let globalVertex = localVertex.applyMatrix4( player.matrix );
        let directionVector = globalVertex.sub( player.position );

        let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        let collisionResults = ray.intersectObjects( collidableMeshList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            //appendText(" Hit ");
            console.log("Hit")
            //console.log(collisionResults.length)
            //console.log(directionVector.length())

            //console.log(collisionResults[0].distance)
        }
    }

    renderer.render( scene, camera )
    requestAnimationFrame( animate )
}
animate()