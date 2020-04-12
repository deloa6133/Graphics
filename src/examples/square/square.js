/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "(render)|(square)" }] */
/* globals Square */


function render(canvas, gl) {
    // DO stuff
    // console.info("This ran.");
    // /** @type {HTMLCanvasElement} */
    // let canvas = document.getElementById("myCanvas");
    // /** @type {WebGLRenderingContext} */
    // let gl = canvas.getContext("webgl");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);

}

var speedx = 0.05;
var speedy = 0.02;
var speedz = 0;
var rotateZ = 0;

let s = new Square();
/**
 * Draws a square
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
function square(gl) {
    // let canvas = document.getElementById("myCanvas");
    // /** @type {WebGLRenderingContext} */
    // let gl = canvas.getContext("webgl");
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // s.setLoc(0.25, -0.25, 0);
    let currLoc = s.getLoc();
    if (currLoc.x > 1 || currLoc.x < -1) {
        speedx *= -1;
    }
    if (currLoc.y > 1 || currLoc.y < -1) {
        speedy *= -1;
    }
    if (currLoc.z > 1 || currLoc.z < -1) {
        speedz *= -1;
    }

    s.setLoc(currLoc.x + speedx, currLoc.y + speedy, currLoc.z + speedz);
    rotateZ += Math.PI / 180;
    s.setRotation(0, 0, rotateZ);
    s.render(gl);

}
