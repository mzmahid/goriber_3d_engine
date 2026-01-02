/** @type {HTMLCanvasElement} */

const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
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
    p.z -= dz;
    return p;
}

function project({x, y, z}) {
    x = x / z;
    y = -y / z; //invert y axis to be accurate with convention
    return {x, y}
}

function rotate({x, y, z}){
    p = {x, y, z};

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
    // let options = [rotX, rotY, rotZ];
    // let pick = Math.round(Math.random() * 2);
    // options[pick](angle);
    let p1 = rotX(p, angle);
    let p2 = rotY(p1, angle);
    let p3 = rotY(p2, angle);
    p1.z -= 1;
    p2.z -= 1;
    p3.z -= 1;
    return p3;


}
    // let pF = {x: (p1.x * p2.x), y: (p1.y * p2.y), z: (p1.z * p2.z)};

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
    let p1, p2;
    for (const e of edges) {
        let v1 = vertices[ e[0] ];
        let v2 = vertices[ e[1] ];
        p1 = cordTranslate( project( rotate(v1) ) );
        p2 = cordTranslate( project( rotate(v2) ) );
        // console.log(p1, p2);
        drawLine(p1,p2);
    }
    // for(const p1 of vertices) {
    //     point(cordTranslate( project( rotate(p1) ) ));
    // }
    // dz += 1*dt;
    angle += Math.PI / 10 * dt;
    setTimeout(animate, 1000/FPS);
}

const FPS = 60;
const dt = 1/FPS;
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

