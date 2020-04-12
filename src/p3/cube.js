/* global  Shape createProgram vertex fragment */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Cube" }] */

/**
 * Cube class that extends Shape class
 * This creates a cube shape with dimension of 1x1x1
 * @author Adam G. Delo
 */
class Cube extends Shape {
    /**
	 * Cube Contructor (Does not take in anything since cube cannot be reduced)
	 */
    constructor() {
        super();

        // Vertices list
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

        // Triangles list
        this.triangles = new Uint8Array([
            0, 1, 3, 5,
            6, 7,
            2, 4,
            0, 1,
            1, 4, 5, 7,
            6, 2, 3, 0
        ]);

        // Edges list
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

        // Give cube color for vertices and edges
        super.colorVertices();
        super.colorEdges();
    }

    /**
	 * Creates the program and buffers the data
	 * @param {WebGLRenderingContext} gl webGL Context
	 */
    bufferData(gl) {
        super.bufferData(gl);
        this.program = createProgram(gl, vertex, fragment);
    }
}
