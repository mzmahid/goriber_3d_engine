/** @type {HTMLCanvasElement} */

const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
const rotBtn = document.querySelector("#rotToggle");
const transList = document.querySelector(".trans");
rotBtn.addEventListener("click", toggleRot);

function toggleRot(){
    canRotate = !canRotate;
}
const ctx = canvas.getContext("2d");
let h = canvas.height;
let w = canvas.width;
let ct = 0;

// let ZnegBtn = document.querySelector("#Zneg");
// let XposBtn = document.querySelector("#Xpos");
// body.appendChild(ZnegBtn);


function clear() {
    ctx.fillStyle = "#050223ff";
    ctx.fillRect(0, 0, w, h);
}

function point({x, y}) {
    ctx.fillStyle = "#ff0000";
    let s = 30;
    ctx.fillRect(x - s/2 , y - s/2, s, s);
    return {x: x - s/2,
            y: y - s/2,
    };
}

function cordTranslate({x, y}) {
    x = (x + 1) / 2 * canvas.width;
    y = (y + 1) / 2 * canvas.height;
    return {x, y};
}

function translate(p,dx=0, dy=0, dz=0) {
    return {
        x : p.x + dx,
        y : p.y - dy,
        z : p.z - dz,
    }
}

function project({x, y, z}) {
    x = x / z;
    y = y / z; //invert y axis to be accurate with convention
    // y += 0.5;
    return {x, y}
}

function rotate({x, y, z}){
    function rotX({x, y, z} ,angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return {
            x: x,
            y: y*cos - z*sin,
            z: y*sin + z*cos,
        }
    }

    function rotY({x, y, z}, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return {
            x: x*cos + z*sin,
            y: y,
            z: -x*sin + z*cos
        }
    }

    function rotZ({x, y, z}, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return {
            x: x*cos - y*sin,
            y: x*sin + y*cos,
            z: z
        }
    }
    p = {x, y, z};
    let p1 = rotY(p, angle);
    let p2 = rotX(p1, angle);
    let p3 = rotZ(p2, angle);
    return p1;


}

function drawLine(p1, p2) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = 1;
    ctx.stroke();
}

function getTraingleEdge (f) {
    let v1, v2;
    let edges = []
    for (let i = 0 ; i < f.length ; i++) {
        v1 = f[i];
        v2 = f[(i + 1) %3];
        edges.push([v1, v2]);
    }
    return edges;
}

transList.addEventListener("click", (e) => {
    target = e.target;
    let mul;
    if(target.textContent === "+") {
        mul = 1;
    } else if(target.textContent === "-") {
        mul = -1;
    } else {
        return; // Not a +/- button, ignore
    }
    let xTrans = 0;
    let yTrans = 0;
    let zTrans = 0;
    if(target.classList.contains("zTrans")) {
        zTrans = mul * 0.1;
    } else if(target.classList.contains("xTrans")) {
        xTrans = mul * 0.1;
    } else if(target.classList.contains("yTrans")) {
        yTrans = mul * 0.1;
    }
    updateTransVector(xTrans, yTrans, zTrans);

})

function updateTransVector(x, y, z){
    t[0] += x;
    t[1] += y;
    t[2] += z;
}


function animate() {
    if(canRotate)
        rotatedVertices = vs.map(v => rotate(v));
    else rotatedVertices = vs;
    clear();
    let p1, p2;
    for (const [idx1, idx2] of edges){
        // console.log(t);
        let x1 = translate(rotatedVertices[idx1], t[0], t[1] , t[2]);
        let x2 = translate(rotatedVertices[idx2], t[0], t[1] , t[2]);
        // t[0] = 0;
        // t[1] = 0;
        // t[2] = 0;

        let v1 = project(x1);
        let v2 = project(x2);

        p1 = cordTranslate(  v1 );
        p2 = cordTranslate( v2 );
        drawLine(p1, p2);

    }
    // dz += 1*dt;
    angle += Math.PI / 10 * dt;
    setTimeout(animate, 1000/FPS);
}

const FPS = 12;
const dt = 1/FPS;
let angle = 0;

let canRotate = false;
let edges = [];
let t = [0, 0, 1];

clear();

for(const f of fs){
    let triangleEdges = getTraingleEdge(f);
    edges.push(...triangleEdges);
}
// edges is an array of arrays that contain two 3d cord object for a single line

animate();