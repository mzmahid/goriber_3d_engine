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
    y = y / z; //invert y axis to be accurate with convention
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
    p1.z -= 1;
    p2.z -= 1;
    p3.z -= 1;
    return p1;


}

function drawLine(p1, p2) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = 2;
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

function animate() {
    clear();
    let p1, p2;
    for(const f of fs){
        let triangleEdges = getTraingleEdge(f);
        // console.log(triangleEdges);
        triangleEdges.map((i) => {
            let v1 = vs[ i[0] ];
            let v2 = vs[ i[1] ];
            p1 = cordTranslate( project( rotate(v1) ) );
            p2 = cordTranslate( project( rotate(v2) ) );
            drawLine(p1, p2);
        })
    }
    // dz += 1*dt;
    angle += Math.PI / 10 * dt;
    setTimeout(animate, 1000/FPS);
}

const FPS = 60;
const dt = 1/FPS;
let angle = 0;



clear();
// console.log(fs);
animate();