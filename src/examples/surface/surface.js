/* global Matrix createProgram */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Surface" }] */

/**
 * vertex shader
 */
const surfaceVertex = `
    attribute vec4 location;
    
    uniform mat4 model;
    uniform mat4 projection;

    varying lowp vec4 cColor;

    void main() {
       gl_Position = projection * model * location;
       cColor = vec4((location.y + 1.0) / 2.0, 0.0, 0.0, 1.0);
    }

`;

/**
 * fragment shader
 */
const surfaceFragment = `
    precision lowp float;
    varying lowp vec4 cColor;

    void main() {
        gl_FragColor = cColor;
    }
`;

const triVertex = `
    attribute vec4 location;
    
    uniform mat4 model;
    uniform mat4 projection;

    void main() {
       gl_Position = projection * model * location;
    }

`;

/**
 * fragment shader
 */
const triFragment = `
    precision lowp float;
    uniform vec4 cColor;
    
    void main() {
        gl_FragColor = cColor;
    }
`;

/**
 * Creates a surface.
 */
class Surface {
    /**
     * Creates a surface.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl, width, height) {
        // shaders
        this.wire = false;
        this.program = createProgram(gl, surfaceVertex, surfaceFragment);
        this.triprogram = createProgram(gl, triVertex, triFragment);
        // vertices
        // TODO create the length of the arrays
        this.vertices = new Float32Array(width * height * 6);
        this.triangles = new Uint16Array((width + 1) * height * 2);

        this.width = width;
        this.height = height;

        let x;
        let y;
        let z;

        let xMin = -1 * Math.PI;
        let zMin = -1 * Math.PI;
        let range = 2 * Math.PI;
        let pos = 0;
        let tpos = 0;

        // TODO draw lines in both directions
        // x, z is split by width and height
        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                x = range / width * c + xMin;
                z = range / height * r + zMin;
                // calc y
                y = Math.cos(x) * Math.cos(2 * z);
                // store the point
                this.vertices[pos] = x;
                this.vertices[pos + 1] = y;
                this.vertices[pos + 2] = z;

                if (r !== 0) {
                    // add two vertices
                    // the currect vertex
                    this.triangles[tpos + 1] = pos / 3;
                    // the vertex in the previous row
                    this.triangles[tpos] = pos / 3 - width;
                    tpos += 2;
                }

                pos += 3;
            }
        }

        for (let c = 0; c < width; c++) {
            for (let r = 0; r < height; r++) {
                x = range / width * c + xMin;
                z = range / height * r + zMin;
                // calc y
                y = Math.cos(x) * Math.cos(2 * z);
                // store the point
                this.vertices[pos] = x;
                this.vertices[pos + 1] = y;
                this.vertices[pos + 2] = z;
                pos += 3;
            }
        }

        // move from model coordinates to world coordinates.
        this.model = new Matrix().scale(2 / (range * 2), 0.25, 2 / (range * 2));

        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate

        this.buffered = false;
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        this.buffered = true;
    }

    // render
    /**
     * Draws a surface using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        let verLoc = gl.getAttribLocation(this.program, "location");
        let matProjection = gl.getUniformLocation(this.program, "projection");
        let matView = gl.getUniformLocation(this.program, "model");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.useProgram(this.program);

        gl.uniformMatrix4fv(matProjection, false, view.getData());
        gl.uniformMatrix4fv(matView, false, this.getModel().getData());

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        // TODO draw lines
        // rows
        for (let r = 0; r < this.height; r++) {
            gl.drawArrays(gl.LINE_STRIP, r * this.width, this.width);
        }

        // columns
        for (let c = 0; c < this.width; c++) {
            gl.drawArrays(gl.LINE_STRIP, c * this.height + this.width * this.height, this.height);
        }

        // triangles
        let backColor = gl.getUniformLocation(this.triprogram, "cColor");
        verLoc = gl.getAttribLocation(this.triprogram, "location");

        matProjection = gl.getUniformLocation(this.triprogram, "projection");
        matView = gl.getUniformLocation(this.triprogram, "model");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.useProgram(this.triprogram);

        gl.uniformMatrix4fv(matProjection, false, view.getData());
        gl.uniformMatrix4fv(matView, false, this.getModel().getData());
        gl.uniform4fv(backColor, new Float32Array([0.5, 0.5, 0.7, 1]));

        for (let r = 0; r < this.height; r++) {
            gl.drawElements(gl.TRIANGLE_STRIP, this.width * 2, gl.UNSIGNED_SHORT, r * this.width * 4);
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
        return this.translateMatrix.mult(this.rotateMatrix).mult(this.scaleMatrix).mult(this.model);
    }
}
