/**
 * @author Adam Delo
 */

/* global Matrix createProgram */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Camera",
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "Cube|Tetra"}] */

/**
 * vertex shader
 */
const shapeVertex = `
    attribute vec4 shapeLocation;
    attribute vec4 shapeColor;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;

    varying lowp vec4 cColor;

    void main() {
       gl_Position = projection * view * model * shapeLocation;
       cColor = shapeColor;
    }

`;

/**
 * fragment shader
 */
const shapeFragment = `
    precision lowp float;
    varying lowp vec4 cColor;

    void main() {
        gl_FragColor = cColor;
    }
`;

/**
 * Base Shape class that contains the default constructors to create the shapes
 * Includes the Translate, Rotate, and Scale functionality of the shapes
 */
class Shape {
    constructor() {
        // Initializes the location to 0
        this.location = {
            x: 0,
            y: 0,
            z: 0
        };

        // Initializes the rotation to 0
        this.rotation = {
            thetaX: 0,
            thetaY: 0,
            thetaZ: 0
        };

        // Initializes the scale to 0
        this.size = {
            width: 1,
            height: 1,
            depth: 1
        };

        // Defines all new matrices
        this.model = new Matrix();
        this.translateMatrix = new Matrix();
        this.rotationMatrix = new Matrix();
        this.scalingMatrix = new Matrix();
        this.world = new Matrix();

        this.buffered = false;
    }

    /**
     * Sets the this.translateMatrix variable to a new translation matrix that uses the
     * parameters for the translation informaton.
     *
     * @param {number} x Amount to translate the cube in the x direction.
     * @param {number} y Amount to translate the cube in the y direction.
     * @param {number} z Amount to translate the cube in the z direction.
     */
    move(x, y, z) {
        this.location.x = x;
        this.location.y = y;
        this.location.z = z;

        let tempMatrix = new Matrix();
        this.translateMatrix = tempMatrix.translate(x, y, z);
    }

    /**
     * @return {Matrix} Returns the matrix after translating
     */
    getLocation() {
        return this.location;
    }

    /**
     * Sets the this.scaleMatrix variable to a new scaling matrix that uses the
     * parameters for the scaling informaton.
     *
     * @param {number} w Amount to scale the cube in the x direction
     * @param {number} h Amount to scale the cube in the y direction
     * @param {number} d Amount to scale the cube in the z direction
     */
    resize(w, h, d) {
        this.size.width = w;
        this.size.height = h;
        this.size.depth = d;

        let tempMatrix = new Matrix();
        this.scaleMatrix = tempMatrix.scale(w, h, d);
    }

    /**
     * @return {Matrix} Returns the matrix after scaling
     */
    getSize() {
        return this.size;
    }

    /**
     * Sets the this.rotateMatrix variable to a new rotation matrix that uses the
     * parameters for the rotation informaton.
     *
     * @param {number} tx Amount in degrees to rotate the cube around the x-axis
     * @param {number} ty Amount in degrees to rotate the cube around the y-axis
     * @param {number} tz Amount in degrees to rotate the cube around the z-axis
     */
    orient(tx, ty, tz) {
        this.rotation.thetaX = tx;
        this.rotation.thetaY = ty;
        this.rotation.thetaZ = tz;

        let tempMatrix = new Matrix();
        this.rotationMatrix = tempMatrix.rotate(tx, ty, tz);
    }

    /**
     * @return {Matrix} Returns the matrix after rotating
     */
    getOrientation() {
        return this.rotation;
    }

    /**
     * Creates a model matrix by combining the other matrices. The matrices should be applied
     * in the order:
     *  world
     *  scaleMatrix
     *  rotateMatrix
     *  translateMatrix
     *
     * @return {Matrix} A matrix with all of the transformations applied to the cube.
     */
    getModel() {
        this.model = this.translateMatrix.mult(this.rotationMatrix).mult(this.scaleMatrix).mult(this.world);
        return this.model;
    }
}

/**
 * Cube class which extends Shape
 * Shape holds all of the basic information
 * Cube is specifying specifically the cube data to be used in the pipeline
 */
class Cube extends Shape {
    /**
     * Creates a cube.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor() {
        // Receives all initial declarations for shape
        super();

        // Specifies the cube vertices
        this.vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            1, 1, 0,
            1, 0, 1,
            0, 1, 1,
            1, 1, 1
        ]);

        // Specifies the cube triangles
        this.triangles = new Uint8Array([
            0, 1, 3, 5,
            6, 7,
            2, 4,
            0, 1,
            1, 4, 5, 7,
            6, 2, 3, 0
        ]);

        // Specifies the initial color of the cube
        this.colors = new Float32Array([
            0, 0, 0, 1,
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            1, 1, 0, 1,
            1, 0, 1, 1,
            0, 1, 1, 1,
            1, 1, 1, 1
        ]);

        // Gives the cube edges to be defined
        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // Edge colors of the cube (All 0, 0, 0, 1)
        this.edgeColors = new Float32Array([
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1
        ]);

        // Gives the cube a world location of -0.5, -0.5, -0.5 which is centered on the origin
        this.world = this.world.translate(-0.5, -0.5, -0.5);
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        // Creates the program
        this.program = createProgram(gl, shapeVertex, shapeFragment);

        // Creates buffers for the vetices, triangles, colors, edges, and edge colors
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.edgesBuffer = gl.createBuffer();
        this.edgeColorsBuffer = gl.createBuffer();

        // Binds and buffers the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // Binds and buffers the triangles
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        // Binds and buffers the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        // Binds and buffers the edges
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.edges, gl.STATIC_DRAW);

        // Bnids and buffers the edge colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.edgeColors, gl.STATIC_DRAW);

        // Sets the buffering to true
        this.buffered = true;
    }

    // render
    /**
     * Draws a cube using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     * @param {Matrix} view view matrix
     */
    render(gl, projection, view) {
        // If not buffered, buffer the data
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // Assigns the shapeLocation and shapeColor from the Vertex Shader
        let vert = gl.getAttribLocation(this.program, "shapeLocation");
        let colr = gl.getAttribLocation(this.program, "shapeColor");

        // Binds the vertices from the Vertex Shader
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);

        // Binds the colors from the Vertex Shader
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(colr, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colr);

        // Starts the program
        gl.useProgram(this.program);

        // Gets the location of the view, projection, and model
        var viewUniform = gl.getUniformLocation(this.program, "view");
        var projectionUniform = gl.getUniformLocation(this.program, "projection");
        var modelUniform = gl.getUniformLocation(this.program, "model");

        // Gets the data from the view, projection, and model
        gl.uniformMatrix4fv(viewUniform, false, view.getData());
        gl.uniformMatrix4fv(projectionUniform, false, projection.getData());
        gl.uniformMatrix4fv(modelUniform, false, this.getModel().getData());

        // Draws the triangles using TRIANGLE_STRIP
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.triangles.length, gl.UNSIGNED_BYTE, 0);

        // binding the edge colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        let eCol = gl.getAttribLocation(this.program, "shapeColor");
        gl.vertexAttribPointer(eCol, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(eCol);

        // Draws the edges of the cube
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }
}

/**
 * Tetra class which extends Shape
 * Shape holds all of the basic information
 * Tetra is specifying specifically the tetra data to be used in the pipeline
 */
class Tetra extends Shape {
    /**
     * Creates a Tetra shape.
     */
    constructor() {
        // Receives all initial declarations for shape
        super();

        // Assigns the base vertices to be used by the Tetra
        this.vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0.5, 0, Math.sqrt(0.75),
            0.5, Math.sqrt(0.75), 0.5
        ]);

        // Triangles array to be used by the Tetra
        this.triangles = new Uint8Array([
            0, 1, 2,
            3,
            0,
            1
        ]);

        // Edges of the tetra
        this.edges = new Uint8Array([
            0, 1,
            0, 2,
            0, 3,
            1, 3,
            1, 2,
            2, 3
        ]);

        // Edge colors of the tetra as a Float32Array (Edges are all black (0, 0, 0, 1))
        this.edgeColors = new Float32Array([
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1
        ]);

        // Defines the initial colors of the tetra shape
        this.colors = new Float32Array([
            0.1, 0.1, 1, 1,
            0.1, 0.1, 1, 1,
            0.1, 1, 0.1, 1,
            0.1, 1, 0.1, 1
        ]);

        // To make the tetra shape forwards directionally, origin was set to 0.5, -0.5, 0.5
        // This means that the shape is technically not "centered" at the origin
        // Moves the tetra shape to the origin of the world
        this.world = this.world.translate(0.5, -0.5, 0.5);
        // Rotates the tetra shape around
        // Since the tetra was moved to accomodate for the rotation, the rotation is set to 180 (flipped)
        this.world = this.world.rotate(0, 180, 0);
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        // Creates the program
        this.program = createProgram(gl, shapeVertex, shapeFragment);

        // Creates buffers for the vertices, triangles, colors, edges, and edge colors
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.edgesBuffer = gl.createBuffer();
        this.edgeColorsBuffer = gl.createBuffer();

        // Binds and buffers the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // Binds and buffers the triangles
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        // Binds and buffers the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        // Binds and buffers the edges
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.edges, gl.STATIC_DRAW);

        // Binds and buffers the edge colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.edgeColors, gl.STATIC_DRAW);

        // Sets buffered to true
        this.buffered = true;
    }

    // render
    /**
     * Draws a cube using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     * @param {Matrix} view view matrix
     */
    render(gl, projection, view) {
        // If Not buffered, buffer the data
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // Gets the location of the shapeLocation and shapeColor from the Vertex Shader
        let vert = gl.getAttribLocation(this.program, "shapeLocation");
        let colr = gl.getAttribLocation(this.program, "shapeColor");

        // Binds the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);

        // Binds the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(colr, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colr);

        // Starts the program
        gl.useProgram(this.program);

        // Gets the location of the view, projection, and model
        var viewUniform = gl.getUniformLocation(this.program, "view");
        var projectionUniform = gl.getUniformLocation(this.program, "projection");
        var modelUniform = gl.getUniformLocation(this.program, "model");

        // Gets the data from the view, projection, and model
        gl.uniformMatrix4fv(viewUniform, false, view.getData());
        gl.uniformMatrix4fv(projectionUniform, false, projection.getData());
        gl.uniformMatrix4fv(modelUniform, false, this.getModel().getData());

        // Draws the triangles using TRIANGLE_STRIP
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.triangles.length, gl.UNSIGNED_BYTE, 0);

        // Binds the edge colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        let eCol = gl.getAttribLocation(this.program, "shapeColor");
        gl.vertexAttribPointer(eCol, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(eCol);

        // Draws the edges of the tetra
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }
}
