// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Mathieu Lebaron and Alex Christensen"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`


//Then: comes everything else
// TODO

import * as THREE from 'three'

let canvas = document.querySelector('#webgl-scene')
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer({canvas})
let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.setClearColor(0xEEEEEE)

let axes = new THREE.AxesHelper(10)
scene.add(axes)

camera.position.set(-200, 400, -200)

let cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
})

window.onkeydown = function(e){
    let t = cameraControls.target
    switch(e.keyCode){
        case 40: // down
            console.log('down')
            break;
        case 38: //up
            console.log('up')
            // t.position.set(t.x - 5, t.y, t.z)
            break;
        case 39: // right
            console.log('right')
            t.set(t.x - 5, t.y, t.z)
            break;
        case 37: // left
            console.log('left')
            t.set(t.x - 5, t.y, t.z)
            break;
    }
}

// Adding light sources
let ambientLight = new THREE.AmbientLight(0x333333)
let directionalLight = new THREE.DirectionalLight(0x777777)
let pointLight = new THREE.PointLight(0x999999)

scene.add(ambientLight)
scene.add(directionalLight)
scene.add(pointLight)

function animate() {
    renderer.render(scene, camera)
    cameraControls.update()
}

animate()