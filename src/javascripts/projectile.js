import * as THREE from "three";
import {textures, scene} from "./main";

export class BallProjectile
{
    constructor()
    {
        this.listPosition = 0;
        this.moveTimer = 0;
        this.explodeTimer = 0;

        //outer ball
        this.geometry = new THREE.SphereGeometry(35, 40,40)
        this.material = new THREE.MeshPhysicalMaterial({color: 0xd7ff52, transparent:true}) //60a85d  7bd977
        this.BFGballMesh = new THREE.Mesh(this.geometry, this.material)
        this.BFGballMesh.material.side = THREE.DoubleSide
        this.BFGballMesh.material.map = textures['BFGball1']

        //inner ball
        let smallBallGeometry = new THREE.SphereGeometry(30, 40,40)
        let smallBallMaterial = new THREE.MeshPhysicalMaterial({color: 0x60a85d}) //60a85d  7bd977
        let smallBallMesh = new THREE.Mesh(smallBallGeometry, smallBallMaterial)
        smallBallMesh.material.map = textures['BFGball2']
        this.BFGballMesh.add(smallBallMesh)
        scene.add(this.BFGballMesh)
    }
}