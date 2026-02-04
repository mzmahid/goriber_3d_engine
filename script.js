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
        y : p.y + dy,
        z : p.z - dz, // invert z axis to math right hand rule
    }
}

function project({x, y, z}) {
    x = x / Math.abs(z);
    y = -y / Math.abs(z); //invert y axis for right hand rule
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

function drawLine(p1, p2, color = "lime") {
    ctx.strokeStyle = color;
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

function fillTriangle(p1, p2, p3) {
    ctx.fillStyle = "rgba(255, 0, 255, 1)";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
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
    if(target.classList.contains("xTrans")) {
        xTrans = mul * 0.5;
    } else if(target.classList.contains("yTrans")) {
        yTrans = mul * 0.5;
    } else if(target.classList.contains("zTrans")) {    
        zTrans = mul * 0.5;
    }
    updateTransVector(xTrans, yTrans, zTrans);

})

function updateTransVector(x, y, z){
    t[0] += x;
    t[1] += y;
    t[2] += z;
}

function cross(p1, p2) { //vector corss product
    return {
        x: p1.y * p2.z - p1.z * p2.y,
        y: p1.z * p2.x - p1.x * p2.z,
        z: p1.x * p2.y - p1.y * p2.x,
    }
}

function disVec(p1, p2) { // distance from vector A to B
    // console.log(x1, y2);
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z,
    }
}   

let frame = 0;
let fps = 0;
let lastTime = performance.now();

function animate(currentTime) {
    frame++;
    if(currentTime - lastTime >= 1000) {
        fps = frame;
        console.log(`FPS = ${fps}`);
        frame = 0;
        lastTime = currentTime;
    }

    if(canRotate)
        rotatedVertices = vs.map(v => rotate(v));
    else rotatedVertices = vs;
    clear();

    for(let face of fs) {
        i1 = face[0];
        i2 = face[1];
        i3 = face[2];
        let v_2 = rotatedVertices[i1];
        let v_1 = rotatedVertices[i2];
        let v_3 = rotatedVertices[i3];

        let normalVec = cross(disVec(v_1, v_3), disVec(v_1, v_2));
        let surfCenter = {
            x: (v_1.x + v_2.x + v_3.x) / 3,
            y: (v_1.y + v_2.y + v_3.y) / 3,
            z: (v_1.z + v_2.z + v_3.z) / 3,
        }
        let normalEnd = {
            x: surfCenter.x + normalVec.x * 1,
            y: surfCenter.y + normalVec.y * 1,
            z: surfCenter.z + normalVec.z * 1,
        }
        surfCenter = cordTranslate(project(translate(surfCenter, t[0], t[1], t[2])));
        normalEnd = cordTranslate(project(translate(normalEnd, t[0], t[1], t[2])));

        drawLine(surfCenter, normalEnd, "red");
    }

    let p1, p2;
    for (const [idx1, idx2] of edges){
        let x1 = translate(rotatedVertices[idx1], t[0], t[1] , t[2]);
        let x2 = translate(rotatedVertices[idx2], t[0], t[1] , t[2]);

        let v1 = project(x1);
        let v2 = project(x2);

        p1 = cordTranslate(v1);
        p2 = cordTranslate(v2);
        drawLine(p1, p2);

    }
    angle += Math.PI / 10 * dt;
    requestAnimationFrame(animate)
}

const FPS = 24;
const dt = 1/FPS;
let angle = 0;

let canRotate = true;
let N = 100000;
const seen = new Set();
let edges = [];
let uniqueEdges = [];
// let t = [0, -2, 4];
let t = [0, 0, 1];

clear();

for(const f of fs){
    let triangleEdges = getTraingleEdge(f);
    for (const [a, b] of triangleEdges) {
        const key = a < b ? a * N + b : b * N + a;
        if(!seen.has(key)) {
            seen.add(key);
            edges.push([a,b]);
        }
    }
}


// edges is an array of arrays that contain two 3d cord object for a single line

requestAnimationFrame(animate);