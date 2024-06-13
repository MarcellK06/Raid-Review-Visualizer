import * as THREE from 'three';

const file = await fetch("./raid.json").then(async (data) => {
    const text = await data.text();
    return text;
});
const readFile = JSON.parse(file);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const npcs = {};
camera.position.y = 3;
camera.fov = 90;
camera.position.x = -4;
camera.rotation.x = THREE.MathUtils.degToRad(-90);
camera.rotation.z = THREE.MathUtils.degToRad(-90);
camera.rotation.y = THREE.MathUtils.degToRad(-60);
var frameCount = 0;
var v_time = 0;
var v_inc = 200;
function animate() {

    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 1000 / 24 );
        
    frameCount++;
    for(var k = 0; k < readFile.length; k++) {
        for(var j = 0; j < readFile[k].length; j++) {
        var previousData = 0;
        if (j > 0)
            {
                previousData = readFile[k][j-1];
            }
        var data = readFile[k][j];
        var nextData = 999999999;
        if (j < readFile[k].length - 1){
        nextData = readFile[k][j+1];
        }


        if (data != undefined) {
        if (npcs[data.profileId] == undefined) {
                if(v_time >= previousData.time && v_time <= nextData.time) {
                    
            if (k == 0) {
                var obj =  new THREE.BoxGeometry( 1, 2, 1 );
                var nCube = new THREE.BoxGeometry(.5, .2, .2);
                var nMesh = new THREE.Mesh(obj, material);
                var rotMarker = new THREE.Mesh(nCube, material2)
                rotMarker.position.z = .1;
                nMesh.add(rotMarker);
                nMesh.add(camera);
                scene.add(nMesh);
                npcs[data.profileId] = [nMesh, rotMarker];
            }
            else {
            var obj =  new THREE.BoxGeometry( 1/2, 2/2, 1/2);
            var nCube = new THREE.BoxGeometry(.5/2, .2/2, .2/2);
            var nMesh = new THREE.Mesh(obj, material2);
            var rotMarker = new THREE.Mesh(nCube, material)
            rotMarker.position.z = .1;
            nMesh.add(rotMarker);
            scene.add(nMesh);
        npcs[data.profileId] = [nMesh, rotMarker];
            }
        }
    }
    }
        if (npcs[data.profileId] != undefined && (v_time >= previousData.time && v_time <= nextData.time    )){
            console.log(v_time);
            var list = npcs[data.profileId];
            list[0].position.x = -parseFloat(data.x);
            list[0].position.y = parseFloat(data.y);
            list[0].position.z = parseFloat(data.z);
            list[0].rotation.y = -THREE.MathUtils.degToRad(parseInt(data.playerFacing)+110);
            j = readFile[k].length;
        }
    }
}
    v_time += v_inc;
    renderer.render(scene, camera);
    }

animate();