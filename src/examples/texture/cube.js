/* global Matrix createProgram */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Cube" }] */

/**
 * vertex shader
 */
const cubeVertex = `
    attribute vec4 cubeLocation;
    attribute vec4 cubeColor;
    attribute vec2 texCoord;

    // TODO add variables for texture
    //  need to pass the data to the fragment shader    

    uniform mat4 view;
    uniform mat4 model;
    uniform mat4 projection;

    varying lowp vec4 cColor;
    varying lowp vec2 tPos;

    void main() {
       gl_Position = projection * view * model * cubeLocation;
       cColor = cubeColor;   
       tPos = texCoord;
    }

`;

/**
 * fragment shader
 */
const cubeFragment = `
    precision lowp float;
    varying lowp vec4 cColor;
    varying lowp vec2 tPos;

    uniform sampler2D tex;
    
    // TODO add variables for texture
        
    void main() {
        // TODO update color
       gl_FragColor = texture2D(tex, tPos) * cColor;
    }
`;

/**
 * Creates a cube centered on the origin with a size of 0.5 units. The cube is
 * shaded to show the color gamut.
 */
class Cube {
    /**
     * Creates a cube.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        // shaders
        this.wire = false;
        this.program = createProgram(gl, cubeVertex, cubeFragment);

        this.vertices = new Float32Array([
            // bottom
            0, 0, 0, // 0
            1, 0, 0, // 1
            0, 0, 1, // 3
            1, 0, 1, // 5
            // front
            0, 0, 1, // 3
            1, 0, 1, // 5
            0, 1, 1, // 6
            1, 1, 1, // 7
            // top
            0, 1, 1, // 6
            1, 1, 1, // 7
            0, 1, 0, // 2
            1, 1, 0, // 4
            // back
            0, 1, 0, // 2
            1, 1, 0, // 4
            0, 0, 0, // 0
            1, 0, 0, // 1
            // right
            1, 0, 0, // 1
            1, 1, 0, // 4
            1, 0, 1, // 5
            1, 1, 1, // 7
            // left
            0, 1, 1, // 6
            0, 1, 0, // 2
            0, 0, 1, // 3
            0, 0, 0 // 0
        ]);

        this.textures = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]);

        // colors
        this.colors = new Float32Array([
            // bottom
            0, 0, 0, 1, // 0
            1, 0, 0, 1, // 1
            0, 0, 1, 1, // 3
            1, 0, 1, 1, // 5
            // front
            0, 0, 1, 1, // 3
            1, 0, 1, 1, // 5
            0, 1, 1, 1, // 6
            1, 1, 1, 1, // 7
            // top
            0, 1, 1, 1, // 6
            1, 1, 1, 1, // 7
            0, 1, 0, 1, // 2
            1, 1, 0, 1, // 4
            // back
            0, 1, 0, 1, // 2
            1, 1, 0, 1, // 4
            0, 0, 0, 1, // 0
            1, 0, 0, 1, // 1
            // right
            1, 0, 0, 1, // 1
            1, 1, 0, 1, // 4
            1, 0, 1, 1, // 5
            1, 1, 1, 1, // 7
            // left
            0, 1, 1, 1, // 6
            0, 1, 0, 1, // 2
            0, 0, 1, 1, // 3
            0, 0, 0, 1 // 0
        ]);

        // move from model coordinates to world coordinates.
        this.view = new Matrix();
        this.view = new Matrix().translate(-0.25, -0.25, -0.25).scale(0.5, 0.5, 0.5);

        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate
        // create identity matrix for the model
        this.model = new Matrix(); // model matrix

        this.buffered = false;
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        this.verticesBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textures, gl.STATIC_DRAW);

        // TODO create and bind texture
        this.tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);

        // TODO create temp texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1, 1, 0, 1]));

        // TODO load image with onload callback
        let img = new Image(1, 1);
        const texture = this.tex;
        img.onload = function() {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        };
        img.src = "texture4.jpg";

        this.buffered = true;
    }

    // render
    /**
     * Draws a cube using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        let verLoc = gl.getAttribLocation(this.program, "cubeLocation");
        let verCol = gl.getAttribLocation(this.program, "cubeColor");
        let matProjection = gl.getUniformLocation(this.program, "projection");
        let matView = gl.getUniformLocation(this.program, "view");
        let matModel = gl.getUniformLocation(this.program, "model");

        // TODO get new shader variables
        let texPos = gl.getAttribLocation(this.program, "texCoord");
        let sampler = gl.getUniformLocation(this.program, "tex");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(verCol, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verCol);

        // TODO add additional bindings for textures
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(texPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texPos);

        gl.useProgram(this.program);


        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matView, false, view.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniform1i(sampler, 1);

        if (!this.wire) {
            // TODO bind texture

            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            for (let i = 0; i < 6; i++) {
                gl.drawArrays(gl.TRIANGLE_STRIP, i * 4, 4);
            }
        }
    }

    /**
     * Sets the this.scaleMatrix variable to a new scaling matrix that uses the
     * parameters for the scaling informaton.
     *
     * @param {number} sx Amount to scale the cube in the x direction
     * @param {number} sy Amount to scale the cube in the y direction
     * @param {number} sz Amount to scale the cube in the z direction
     */
    scale(sx, sy, sz) {
        this.scaleMatrix = new Matrix();
        this.scaleMatrix = this.scaleMatrix.scale(sx, sy, sz);
    }

    /**
     * Sets the this.rotateMatrix variable to a new rotation matrix that uses the
     * parameters for the rotation informaton.
     *
     * @param {number} xtheta Amount in degrees to rotate the cube around the x-axis
     * @param {number} ytheta Amount in degrees to rotate the cube around the y-axis
     * @param {number} ztheta Amount in degrees to rotate the cube around the z-axis
     */
    rotate(xtheta, ytheta, ztheta) {
        this.rotateMatrix = new Matrix();
        this.rotateMatrix = this.rotateMatrix.rotate(xtheta, ytheta, ztheta);
    }

    /**
     * Sets the this.translateMatrix variable to a new translation matrix that uses the
     * parameters for the translation informaton.
     *
     * @param {number} tx Amount to translate the cube in the x direction.
     * @param {number} ty Amount to translate the cube in the y direction.
     * @param {number} tz Amount to translate the cube in the z direction.
     */
    translate(tx, ty, tz) {
        this.translateMatrix = new Matrix();
        this.translateMatrix = this.translateMatrix.translate(tx, ty, tz);
    }

    /**
     * Creates a model matrix by combining the other matrices. The matrices should be applied
     * in the order:
     *  view
     *  scaleMatrix
     *  rotateMatrix
     *  translateMatrix
     *
     * @return {Matrix} A matrix with all of the transformations applied to the cube.
     */
    getModel() {
        this.model = this.translateMatrix.mult(this.rotateMatrix).mult(this.scaleMatrix).mult(this.view);
        return this.model;
    }
}
