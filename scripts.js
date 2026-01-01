/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let h = canvas.height;
let w = canvas.width;

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

function translate({x, y, z}) {
    z += dz;
    return {x, y, z};
}

function project({x, y, z}) {
    x = x / z;
    y = -y / z; //invert y axis to be accurate with convention
    return {x, y}
}

function rotate({x, y, z}){
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    // x = x * Math.cos(angle) - z * Math.sin(angle);
    // z = x * Math.sin(angle) + y * Math.cos(angle);
    return {
        x: x * cos - z * sin,
        y: y,
        z : x * sin + z * cos - 1, //step back 1 unit to view it from outside.
    }

}

function drawLine(p1, p2) {
    ctx.strokeStyle = "lime";
    // ctx.beginPath(p1.x, p1.y);
    // ctx.moveTo(p2.x, p2.y);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = 5;
    ctx.stroke();
}

function animate() {
    clear();
    for (const e of edges) {
        let v1 = vertices[ e[0] ];
        let v2 = vertices[ e[1] ];
        let p1 = cordTranslate( project( rotate(v1) ) );
        p2 = cordTranslate( project( rotate(v2) ) );
        // let p2 = {x:69, y:69};
        // console.log(p1, p2);
        drawLine(p1,p2);
    }
    dz += 1*dt;
    angle += Math.PI / 3 * dt;
    // drawLine(vertices);
    setTimeout(animate, 1000/FPS);
}

const FPS = 60;
const dt = 1/FPS;
let dz = 0;
let z = 10; // z axis positive is towards the viewer, negative inside screen.
let angle = 0;
const vertices = [
    {x:  0.25, y:  0.25, z:  0.25},
    {x: -0.25, y:  0.25, z:  0.25},
    {x: -0.25, y: -0.25, z:  0.25},
    {x:  0.25, y: -0.25, z:  0.25},

    {x:  0.25, y:  0.25, z: -0.25},
    {x: -0.25, y:  0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
    {x:  0.25, y: -0.25, z: -0.25},
]

const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
]

clear();
animate();

