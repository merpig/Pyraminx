import { useEffect } from "react";
import * as THREE from "three";
import {CameraControls, dToR, rotate_point} from "./utils.js";

import "./index.css"
import Menu from "../Menu/Menu";
import rightArrow from "./arrow.png";
import leftArrow from "./leftArrow.png";

const PyraMinx = ({reset}) => {
    // Added csc to Math library
    Math.csc = function(x) { return 1 / Math.sin(x); }

    // UI and megaminx controller variables
    let faceToRotate = "face0"; // Controls which face will rotate
    let moveQueue = []; // Moves in here will be immediately played
    let moveLog = [];
    let moveLogIndex = 0;
    let speedChanged = false; // Signals a queued speed change
    let speedHolder = 12; // Queued speed change
    let speed = 12; // Default move speed (must divide evenly into 72)
    let counter = 0; // Theta counter for piece rotation (counts to 72)
    let updateMouse = false; // Signals mouse can be updated in mousemove
    let currentFunc = "none"; // Current state of the menu
    let undoRedo = false;
    let moveSetter;
    let moveType;
    let moveCurrent;
    let modeSetter;
    let manualTurn = "none";

    // Used for touch/mouse rotations
    let startPoint = null;
    let newPoint = null;
    let selectedSide = null;
    let selectedPiece = null;

    // Threejs variables
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, .1, 1000 );
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let controls = CameraControls(camera, renderer,scene);

    // Set/Get manualTurn
    let getTurn = () => manualTurn;
    let setTurn = () => manualTurn="none";

    let setMoveQueue = (moves,force,setCurrentMove,currentMove,type,mode) => {
        if(force){
            moveQueue = moves;
            return;
        }
        moveSetter=setCurrentMove;
        moveType=moveType?moveType:type;
        moveCurrent=currentMove;
        modeSetter=mode;
        moveQueue = !moveQueue.length?moves:moveQueue;
    }

    let getCounter = () => counter;

    // getter and setter for speed holder
    let getSpeed = () => speedHolder;
    let setSpeed = speed => {
        switch(speed){
            case 0:
                speedHolder = .25;
                break;
            case 1:
                speedHolder = .5;
                break;
            case 2:
                speedHolder = 1;
                break;
            case 3:
                speedHolder = 3;
                break;
            case 4:
                speedHolder = 6;
                break;
            case 5:
                speedHolder = 12;
                break;
            case 6:
                speedHolder = 24;
                break;
            case 7:
                speedHolder = 72;
                break;
            default:
        }
        speedChanged=true
    }

    let reverseMove = move => {
        console.log(move);
        return move.split('').includes("'")?move.replace("'",""):move+"'"
    }

    //let getMoveLogIndex = () => moveLogIndex;
    let setMoveLogIndex = n => {
        
        console.log(moveLogIndex)

        if(n>=0&&moveLogIndex<=moveLog.length-1){
            undoRedo=true;
            moveQueue.push(moveLog[moveLogIndex])
            moveLogIndex++;
        } 

        else if(n<0&&moveLogIndex>0){
            undoRedo=true;
            moveLogIndex--;
            moveQueue.push(reverseMove(moveLog[moveLogIndex]));
        }

    }

    // getter and setter for currentFunc
    let currentFunction = () => currentFunc;
    let setCurrentFunction = func => currentFunc = func;

    let getCpVars = () => {return {camera,mouse,raycaster,scene};}

    // Holds references to all the rendered pieces
    let pyraObject = {};
    let rightHints = {};
    let leftHints = {};

    let getPyra = () => pyraObject;
    
    // Set background color and size
    renderer.setClearColor(new THREE.Color("black"),0);
    renderer.domElement.className = "canvas";
    renderer.setSize( window.innerWidth, window.innerHeight);

    camera.position.z = 15;
    camera.position.y = 0;
    camera.position.x = 0;

    renderer.render( scene, camera );

    function onMouseDown(e) {
        // update mouse position
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        // reset piece selection data
        startPoint = null;
        selectedSide = null;
        selectedPiece = null;
        
        // Set the raycaster to check for intersected objects
        raycaster.setFromCamera( mouse, camera );

        const intersects = raycaster.intersectObjects( scene.children );

        // Filter only pieces that should be interacted with
        let filteredIntersects = intersects.filter(
            e=>e.object.name==="corner"||e.object.name==="edge"
        );

        // if a piece is intersected disable camera rotation
        if(intersects[0]) {
            controls.enabled = false;
        }

        // Enable mouse movement position updating
        if(
            filteredIntersects[0] && 
            !moveQueue.length 
            && ["none","solver","patterns"].includes(currentFunc)
        ){
            updateMouse = true;

            // Values to be used for touch turns
            selectedPiece = filteredIntersects[0].object.piece;

            // Testing for piece 8 first
            if((selectedPiece>0&&selectedPiece<11)){
                startPoint = filteredIntersects[0].uv;
                selectedSide = filteredIntersects[0].object.side;
            }
        }
        // For non interactable pieces
        else if(!filteredIntersects[0]&&intersects[0]){
            updateMouse = true;
            selectedPiece = intersects[0].object.piece;
        }

        // Change the clicked piece color to the selected color
        if(currentFunc==="colorpicker"&&filteredIntersects[0]){
            //filteredIntersects[0].object.material.color.set(currentColor)
        }
    }

    function onMouseMove(e){
        // add code later
    }

    function onMouseMove(e){
        if(currentFunc === "colorpicker") return;
        if(e.pointerType==="touch") controls.enabled = true;
        // If no piece was clicked end function
        if(!updateMouse) {
            return;
        }
    }

    function onMouseUp(e) {
        controls.enabled = true;
        updateMouse=false;
    }

    // Event listeners
    window.addEventListener("resize", 
        () => {
            let tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
            let windowHeight = window.innerHeight;

            camera.aspect = window.innerWidth / window.innerHeight;
            
            // adjust the FOV
            camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );
            
            camera.updateProjectionMatrix();
            camera.lookAt( scene.position );

            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.render( scene, camera );
        }, false
    );

    useEffect(()=>{

        function removeElementsByClass(className){
            const elements = document.getElementsByClassName(className);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }
        removeElementsByClass("canvas");

        document.body.children[1].appendChild( renderer.domElement );
        window.addEventListener("pointerdown",onMouseDown,false);
        window.addEventListener("pointerup",onMouseUp,false);
        window.addEventListener("pointermove",onMouseMove,false);

        return function cleanup () {
            window.removeEventListener("pointerdown",onMouseDown,false)
            window.removeEventListener("pointerup",onMouseUp,false)
            window.removeEventListener("pointermove",onMouseMove,false);
        }
    });

    function triangleMesh(n,translate,rotate,color,name,i){
        let triangleMesh, triangleMesh2;
        const lineWidth = .97;
        n=n?n:1;

        const triangle = new THREE.Shape();
        const triangle2 = new THREE.Shape();

        triangle.moveTo(0, 1*n);
        triangle.lineTo(...rotate_point(0,0,120,{x:0,y: 1*n}));
        triangle.lineTo(...rotate_point(0,0,240,{x:0,y:1*n}));

        triangle2.moveTo(0, 1*n*lineWidth);
        triangle2.lineTo(...rotate_point(0,0,120,{x: 0,y: (1*n)*lineWidth}));
        triangle2.lineTo(...rotate_point(0,0,240,{x:0,y: (1*n)*lineWidth}));

        const geometry = new THREE.ShapeGeometry(triangle);
        const geometry2 = new THREE.ShapeGeometry(triangle2);

        const material = new THREE.MeshBasicMaterial({
            color: "black",
            side: THREE.DoubleSide,
            depthWrite: true,
        });
        const material2 = new THREE.MeshBasicMaterial({
            color: "green",
            side: THREE.FrontSide,
            depthWrite: true,
        });

        let offsetZ =.005;

        
        triangleMesh = new THREE.Mesh(geometry,material);
        triangleMesh2 = new THREE.Mesh(geometry2,material2);

        triangleMesh2.translateZ(offsetZ);

        scene.add(triangleMesh,triangleMesh2);
    }

    triangleMesh(1);

    const loader = new THREE.TextureLoader();
    const right = loader.load(rightArrow);
    const left = loader.load(leftArrow);
    // Prevents bluring
    right.anisotropy = renderer.capabilities.getMaxAnisotropy();
    left.anisotropy = renderer.capabilities.getMaxAnisotropy();

    let animate = () => {
        //rotateFace(faceToRotate);
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    };

    animate();
    return (
        <Menu 
            setMoveQueue={setMoveQueue}
            resetMegaMinx={reset}
            reset={reset}
            setCurrentFunction={setCurrentFunction}
            currentFunction={currentFunction}
            setSpeed={setSpeed}
            speed={getSpeed}
            setMoveLogIndex={setMoveLogIndex}
            pyraObject={pyraObject}
            getPyra={getPyra}
            getCounter={getCounter}
            getCpVars={getCpVars}
            rightHints={rightHints}
            leftHints={leftHints}
            getTurn={getTurn}
            setTurn={setTurn}
        />
    );
}

export default PyraMinx;