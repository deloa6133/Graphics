// Author: Adam Delo
// Date: 09/19/2019

/* eslint no-unused-vars: ["warn", {"varsIgnorePattern": "(render)|(display)"}]*/

// Constant vertex shader variable with vec4 location assigned
const vertexShader = `
    attribute vec4 location;

    void main() {
        // assign a value to gl_Position
        gl_Position = location;
    }
`;

/**
 * Render function to create the canvas on the screen and draw the shapes
 * Draws the star, hexagon, and circle
 * Creates the size of the WebGL canvas and gives the canvas the context of "webgl"
 */
function render() {
    // Get the canvas drawArea from HTML file
    let canvas = document.getElementById("drawArea");
    // Get a WebGL context
    let gl = canvas.getContext("webgl");
    // Create the size of the WebGL Canvas
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
    // Clear the background of the canvas
    gl.clearColor(0, 0.75, 1, 0.2);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw function executions for the star, hexagon, and circle
    drawStar(gl);
    drawHexagon(gl);
    drawCircle(gl);
}

/**
 * Draws a star in the graphics context
 * @param {WebGLRenderingContext} gl WebGL graphics context
 */
function drawStar(gl) {
    // Create buffer
    let buffer = gl.createBuffer();
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Create data in an array for the vertices of the star
    let star = new Float32Array([
        0.0, 0.7,
        -0.4, -0.4,
        0.2, 0.0,
        0.0, 0.7,
        0.4, -0.4,
        -0.2, 0.0,
        0.0, -0.1,
        0.6, 0.3,
        -0.6, 0.3
    ]);

    // Buffer the data
    gl.bufferData(gl.ARRAY_BUFFER, star, gl.STATIC_DRAW);

    // Check again to make sure buffer is active (redundant)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Program to bind shaders together
    let program = createProgram(gl, vertexShader,
        document.getElementById("starFragment").innerText);
    // Bind the program and the shaders to the data
    // Get the location of attribute variables
    let loc = gl.getAttribLocation(program, "location");
    // Bind
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); // Would be (loc, 3, gl.FLOAT, false, 0, 0) if I had used three points instead of 2 in let square = new 32floatarray (){ 0,10,101,01,1,101}
    // Enable bindings
    gl.enableVertexAttribArray(loc);
    // Use program
    gl.useProgram(program);

    // Uses TRIANGLE_STRIP to create the star in the graphics context
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 9);
}

/**
 * Draws a hexagon in the graphics context
 * @param {WebGLRenderingContext} gl WebGL graphics context
 */
function drawHexagon(gl) {
    // Create buffer
    let buffer = gl.createBuffer();
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // r = radius; theta = angle; size = vertices
    let r = 0.2;
    let size = 6;

    // Create data in an array for the hexagon vertices
    let hexagon = [];

    // I was unable to successfully calculate the proper way to use polar coordinates
    let i = 0;
    for (i; i < size; i++) {
        // Calculates the angle required to create the vertices of the hexagon
        let x = r * Math.cos(i * Math.PI / 3) - 0.7;
        let y = r * Math.sin(i * Math.PI / 3) - 0.7;
        // Pushes the vertex into the array of vertices called hexagon
        hexagon.push(x, y);
    }

    // Buffer the data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagon), gl.STATIC_DRAW);

    // Check again to make sure buffer is active (redundant)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Program to bind shaders together
    let program = createProgram(gl, vertexShader,
        document.getElementById("hexagonFragment").innerText);
    // Bind the program and the shaders to the data
    // Get the location of attribute variables
    let loc = gl.getAttribLocation(program, "location");
    // Bind
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    // Enable bindings
    gl.enableVertexAttribArray(loc);
    // Use program
    gl.useProgram(program);

    // Uses TRIANGLE_FAN to create the hexagon in the graphics context
    gl.drawArrays(gl.TRIANGLE_FAN, 0, size);
}

/**
 * Draws a circle in the graphics context
 * @param {WebGLRenderingContext} gl WebGL graphics context
 */
function drawCircle(gl) {
    // Create buffer
    let buffer = gl.createBuffer();
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // r = radius; theta = angle; size = vertices
    let r = 0.2;
    let theta = 0;
    let size = 360;

    // Create data in an array for vertices of the circle
    let circle = [];

    // I was unable to successfully calculate the proper way to use polar coordinates
    let i = 0;
    for (i; i < size; i++) {
        // Calculates the angle required to create the vertices of the hexagon
        let x = r * Math.cos(theta * 2 * Math.PI / size) + 0.7;
        let y = r * Math.sin(theta * 2 * Math.PI / size) - 0.7;
        theta++;
        // Pushes the vertex into the array of vertices called circle
        circle.push(x, y);
    }

    // Buffer the data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circle), gl.STATIC_DRAW);

    // Check again to make sure buffer is active (redundant)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Program to bind shaders together
    let program = createProgram(gl, vertexShader,
        document.getElementById("circleFragment").innerText);
    // Bind the program and the shaders to the data
    // Get the location of attribute variables
    let loc = gl.getAttribLocation(program, "location");
    // Bind
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); // Would be (loc, 3, gl.FLOAT, false, 0, 0) if I had used three points instead of 2 in let square = new 32floatarray (){ 0,10,101,01,1,101}
    // Enable bindings
    gl.enableVertexAttribArray(loc);
    // Use program
    gl.useProgram(program);

    // Uses TRIANGLE_FAN to create the circle in the graphics context
    gl.drawArrays(gl.TRIANGLE_FAN, 0, size);
}

/**
 * Loads and compiles the shader
 * @param {WebGLRenderingContext} gl
 * @param {string} src
 * @param {Number} type
 * @returns {shader, null} Returns the shader to be used as a pass-through shader in the program; If there is an error, returns null instead
 */
function loadShader(gl, src, type) {

    // Shader variable with type as definition
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    // Compiles the shader variable
    gl.compileShader(shader);

    // Determines if there are errors within the shader; if there are errors, displays the error to console
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Get the compiler errors
        console.error(gl.getShaderInfoLog(shader));
        // Delete the shader
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * Creates the program for the vertex and fragment shaders
 * @param {WebGLRenderingContext} gl
 * @param {String} vertexSrc
 * @param {String} fragmentSrc
 * @returns {program, null} Returns the program to be used in the graphics context; If there is an error, returns null instead
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
    // Create the shaders
    let vertex = loadShader(gl, vertexSrc, gl.VERTEX_SHADER);
    let fragment = loadShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);

    // Create the program
    let program = gl.createProgram();

    // Attach the shaders
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);

    // Link the program
    gl.linkProgram(program);

    // Check the results to determine if there are any errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // Outputs the errors if there are any
        console.error(gl.getProgramInfoLog(program));
        // Deletes the program
        gl.deleteProgram(program);
        return null;
    }

    return program;
}
