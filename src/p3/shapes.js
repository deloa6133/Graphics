/* global Matrix */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Shape|fragment|vertex" }] */

/**
 * @author Adam G. Delo
 */

/**
 * Vertex shader
 */
const vertex = `
    attribute vec4 location;
    attribute vec4 color;
    uniform mat4 model;
	uniform mat4 projection;
	uniform mat4 view;
    varying lowp vec4 cColor;
    void main() {
       gl_Position = projection * view * model * location;
       cColor = color;
    }
`;

/**
 * Fragment shader
 */
const fragment = `
    precision lowp float;
    varying lowp vec4 cColor;
    void main() {
        gl_FragColor = cColor;
    }
`;

/**
 * Shape class to be used by all other shapes to be drawn
 * Used for the creation of the cube, cylinder, and sphere
 */
class Shape {
    /**
	 * Shape Constructor that does not take in data
	 */
    constructor() {
        // Sets the base size to 1 and centers the object on the origin
        this.size = [1, 1, 1];
        this.location = [0, 0, 0];
        this.orientation = [0, 0, 0];

        this.wire = false;
        this.program = null;

        // Vertices
        this.vertices = new Float32Array([]);

        // Triangles
        this.triangles = new Uint8Array([]);

        // Colors
        this.colors = new Float32Array([]);

        // Edges
        this.edges = new Uint8Array([]);

        // Edge colors
        this.edgeColors = new Float32Array([]);

        // Scale, Rotate, and Translate identity matrix
        this.scaleMatrix = new Matrix();
        this.rotateMatrix = new Matrix();
        this.translateMatrix = new Matrix();

        // Model Matrix
        this.model = new Matrix();
        // Scale the model to 1/2 original size and translate to center on origin
        this.center = new Matrix().translate(-0.25, -0.25, -0.25).scale(0.5, 0.5, 0.5);

        this.buffered = false;
    }

    /**
     * Creates the buffers for the program
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        // Creates buffers for the vertices, triangles, colors, edges, and edge colors
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.edgesBuffer = gl.createBuffer();
        this.edgeColorsBuffer = gl.createBuffer();

        // Bind and buffer the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // Bind and buffer the triangles
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        // Bind and buffer the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        // Bind and buffer the edges
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.edges, gl.STATIC_DRAW);

        // Bind and buffer the edge colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.edgeColors, gl.STATIC_DRAW);

        this.buffered = true;
    }

    /**
	 * Renders the shapes
	 * @param {WebGLRenderingContext} gl webGL context
	 * @param {Matrix} projection Current shape projection
	 * @param {Matrix} view Current shape view
	 */
    render(gl, projection, view) {
        // If not already buffered, buffer the data
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // Gets the attribute and uniform data locations
        let verLoc = gl.getAttribLocation(this.program, "location");
        let colorsLoc = gl.getAttribLocation(this.program, "color");
        let matProjection = gl.getUniformLocation(this.program, "projection");
        let matModel = gl.getUniformLocation(this.program, "model");
        let matView = gl.getUniformLocation(this.program, "view");

        // Location buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        // Color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(colorsLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorsLoc);

        // Starts the program
        gl.useProgram(this.program);

        // Gets the data from the buffers
        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniformMatrix4fv(matView, false, view.getData());

        if (!this.wire) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP, this.triangles.length, gl.UNSIGNED_BYTE, 0);
        }

        // Edges buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.vertexAttribPointer(colorsLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorsLoc);

        // Draws the edges using LINES
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }

    /**
	 * Translate the shape
	 * @param {Number} x The X axis of the shape to move in
	 * @param {Number} y The Y axis of the shape to move in
	 * @param {Number} z The Z axis of the shape to move in
	 */
    move(x, y, z) {
        this.translateMatrix = new Matrix();
        this.translateMatrix = this.translateMatrix.translate(x, y, z);
        this.location = [this.location[0] + x, this.location[1] + y, this.location[2] + z];
    }

    /**
	 * Returns the location of the object
	 * @returns {Array} Current location of the object
	 */
    getLocation() {
        return this.location;
    }

    /**
	 * Scales the shape
	 * @param {Number} w Width of the shape
	 * @param {Number} h Height of the shape
	 * @param {Number} d Depth of the shape
	 */
    resize(w, h, d) {
        this.scaleMatrix = new Matrix();
        this.scaleMatrix = this.scaleMatrix.scale(w, h, d);
        this.size = [this.size[0] * w, this.size[1] * h, this.size[2] * d];
    }

    /**
	 * Returns the scale of the object
	 * @returns {Array} The current scale of the object
	 */
    getSize() {
        return this.size;
    }

    /**
	 * Rotates the object
	 * @param {Number} tx Amount to rotate in the x-axis
	 * @param {Number} ty Amount to rotate in the y-axis
	 * @param {Number} tz Amount to rotate in the z-axis
	 */
    orient(tx, ty, tz) {
        this.rotateMatrix = new Matrix();
        this.rotateMatrix = this.rotateMatrix.rotate(tx, ty, tz);
        this.orientation = [this.orientation[0] + tx, this.orientation[1] + ty, this.orientation[2] + tz];
    }

    /**
	 * Returns the orientation of the object
	 * @returns {Array} Current orientation of the object
	 */
    getOrientation() {
        return this.orientation;
    }

    /**
     * Creates a model matrix by combining the other matrices
     * @return {Matrix} Matrix with all other transformations applied to the object
     */
    getModel() {
        return this.translateMatrix.mult(this.rotateMatrix).mult(this.scaleMatrix).mult(this.center).mult(this.model);
    }

    /**
	 * Gives each shape vertex a green color
	 */
    colorVertices() {
        let colors = [];
        for (let i = 0; i < this.vertices.length; i++) {
            colors.push(0.3, 1, 0.3, 1);
        }
        this.colors = new Float32Array(colors);
    }

    /**
	 * Gives each edge a black color
	 */
    colorEdges() {
        let edgeColors = [];
        for (let i = 0; i < this.edges.length; i++) {
            edgeColors.push(0, 0, 0, 1);
        }
        this.edgeColors = new Float32Array(edgeColors);
    }
}
