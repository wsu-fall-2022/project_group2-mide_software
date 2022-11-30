import * as THREE from "three";
import {textures, scene} from "./main";

export class BallProjectile
{
    constructor()
    {
        //outer ball
        this.geometry = new THREE.SphereGeometry(10, 40,40)
        this.material = new THREE.MeshPhysicalMaterial({color: 0x60a85d, transmission:0.2, transparent:true}) //60a85d  7bd977
        this.BFGballMesh = new THREE.Mesh(this.geometry, this.material)
        this.BFGballMesh.material.map = textures['BFGball1']

        //inner ball
        let smallBallGeometry = new THREE.SphereGeometry(8, 40,40)
        let smallBallMaterial = new THREE.MeshPhysicalMaterial({color: 0x60a85d, transmission:0.5, transparent:true}) //60a85d  7bd977
        let smallBallMesh = new THREE.Mesh(smallBallGeometry, smallBallMaterial)
        smallBallMesh.material.map = textures['BFGball2']
        this.BFGballMesh.add(smallBallMesh)
        scene.add(this.BFGballMesh)
    }
}