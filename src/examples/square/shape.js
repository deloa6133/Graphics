/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Square" }] */

const squareVertex = `

    attribute vec4 vertex;
    uniform mat4 model;

    void main() {
        // assign a value to gl_Position
        gl_Position = model * vertex;
    }

`;

/**
 *
 * @param {String} src Source code
 * @param {Number} shaderType
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 *
 * @return {WebGLShader} Compiled shader or null
 */
function loadShader(gl, shaderType, src) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // get the compiler errors
        console.error(gl.getShaderInfoLog(shader));
        // delete the shader
        gl.deleteShader(shader);

        return null;
    }

    return shader;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {String} vertexSrc
 * @param {String} fragmentSrc
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSrc);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);

        return null;
    }

    return program;
}


class Shape {
    constructor() {

        this.buffered = false;
        this.program = null;
        this.buffer = null;
        this.vertices = null;

        this.color = [0, 0, 0, 1];

        this.loc = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            width: 1,
            height: 1
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    setRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }

    // getters/setter
    getLoc() {
        return this.loc;
    }

    setLoc(x, y, z) {
        this.loc.x = x;
        this.loc.y = y;
        this.loc.z = z;
    }


    /**
     * Draws something
     *
     * @param {WebGLRenderingContext} _gl WebGL context to draw to
     */
    // eslint-disable-next-line no-unused-vars
    render(gl) {
        console.error("Implement me!");
        // throw exception?
    }
}

class Square extends Shape {

    constructor() {
        super();

        // square's setup
        // create the verices for the square
        this.vertices = [-0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0];
    }

    bufferData(gl) {
        // create buffer
        this.buffer = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // buffer the data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.program = createProgram(gl, squareVertex,
            document.getElementById("fragShader").innerText);
    }

    // render
    /**
 * Draws something
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
    render(gl) {
        if (!this.buffered) {
            this.bufferData(gl);
            this.buffered = true;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        let vert = gl.getAttribLocation(this.program, "vertex");
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);

        gl.useProgram(this.program);

        let model = gl.getUniformLocation(this.program, "model");

        let s = Math.sin(this.rotation.z);
        let c = Math.cos(this.rotation.z);
        gl.uniformMatrix4fv(model, false, new Float32Array(
            [c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                this.loc.x, this.loc.y, this.loc.z, 1]));

        // make sure the buffer is active
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
}
