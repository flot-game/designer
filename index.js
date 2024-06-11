import InstructionConfig from "./lib/InstructionConfig.js";
import Instruction from "./lib/Instruction.js";
import Path from "./lib/Path.js";

// Expose
window.InstructionConfig = InstructionConfig;
window.Instruction = Instruction;
window.Path = Path;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
}

function getScale() {
    if (canvas.height > canvas.width) {
        return canvas.height / 1080;
    }

    return canvas.width / 1920;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/**
 * @type {Path[]}
 */
const paths = [];

if (localStorage.flotPathData) {
    const data = JSON.parse(localStorage.flotPathData);
    console.log(data);

    for (const pathData of data) {
        const path = Path.fromSaveData(pathData);

        paths.push(path);
    }
} else {
    paths.push(new Path());
}

paths.forEach(path => path.initUI());

document.getElementById("saveButton").onclick = () => {
    const data = [];

    for (const path of paths) {
        data.push(path.getSaveData());
    }

    localStorage.flotPathData = JSON.stringify(data);
}

document.getElementById("addPathButton").onclick = () => {
    const path = new Path();
    paths.push(path);
    path.initUI();
}

document.getElementById("export").onclick = () => {
    const downloadImageSize = 2048;
    const scale = 2048 / 100;

    const canvas = document.createElement("canvas");
    canvas.width = downloadImageSize;
    canvas.height = downloadImageSize;
    
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        if (path.shouldDelete) {
            paths.splice(i, 1);
            i--;
            continue;
        }

        path.draw(ctx);
    }

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "flot.png";
    a.click();
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = getScale();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    const internalScale = (Math.min(canvas.width, canvas.height) * scale - 10) / 2048;
    ctx.scale(internalScale, internalScale);

    ctx.beginPath();
    ctx.rect(-1024, -1024, 2048, 2048);
    ctx.stroke();
    ctx.closePath();

    ctx.scale(10.24, 10.24);

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        if (path.shouldDelete) {
            paths.splice(i, 1);
            i--;
            continue;
        }

        path.draw(ctx);
    }

    ctx.restore();
}

draw();