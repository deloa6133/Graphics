/* global  Shape createProgram vertex fragment Matrix Vector */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Sphere" }] */

/**
 * Sphere class that extends the Shape class
 * @author Adam G. Delo
 */
class Sphere extends Shape {
    /**
	 * Shpere Contructor
	 */
    constructor(divideAmount) {
        super();
        let vertices = [];
        let edges = [];

        // Array list of vertices creating an octahedron
        vertices.push(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,

            1, 0, 0,
            0, 0, -1,
            0, 1, 0,

            1, 0, 0,
            0, 0, 1,
            0, -1, 0,

            1, 0, 0,
            0, -1, 0,
            0, 0, -1,

            -1, 0, 0,
            0, 0, 1,
            0, 1, 0,

            -1, 0, 0,
            0, 1, 0,
            0, 0, -1,

            -1, 0, 0,
            0, -1, 0,
            0, 0, 1,

            -1, 0, 0,
            0, 0, -1,
            0, -1, 0
        );

        // Generate verticies for the sphere
        for (let divideBy = 1; divideBy < divideAmount; divideBy++) {
            let newVertices = [];
            for (let i = 0; i < vertices.length; i += 9) {
                // Used each vertex to get the triangles separated as A, B, and C
                let A = new Vector([vertices[i], vertices[i + 1], vertices[i + 2]]);
                let B = new Vector([vertices[i + 3], vertices[i + 4], vertices[i + 5]]);
                let C = new Vector([vertices[i + 6], vertices[i + 7], vertices[i + 8]]);

                // Get the midpoint for each edge of the triangle
                let AB = findMidpoint(A, B);
                let AC = findMidpoint(A, C);
                let BC = findMidpoint(B, C);

                // Normalize (and scale by radius; however scale is 1)
                AB = AB.normalize();
                AC = AC.normalize();
                BC = BC.normalize();

                // Push the vertices into a new array list of vertices
                newVertices.push(
                    A.getX(), A.getY(), A.getZ(),
                    AB.getX(), AB.getY(), AB.getZ(),
                    AC.getX(), AC.getY(), AC.getZ(),

                    AB.getX(), AB.getY(), AB.getZ(),
                    B.getX(), B.getY(), B.getZ(),
                    BC.getX(), BC.getY(), BC.getZ(),

                    BC.getX(), BC.getY(), BC.getZ(),
                    C.getX(), C.getY(), C.getZ(),
                    AC.getX(), AC.getY(), AC.getZ(),

                    AB.getX(), AB.getY(), AB.getZ(),
                    BC.getX(), BC.getY(), BC.getZ(),
                    AC.getX(), AC.getY(), AC.getZ()
                );
            }
            // Set previous list of vertices to the new list of vertices
            vertices = newVertices;
        }

        this.vertices = new Float32Array(vertices);

        // Generate edges for the sphere
        for (let i = 0; i < vertices.length / 3; i += 3) {
            edges.push(i, i + 1);
            edges.push(i, i + 2);
            edges.push(i + 1, i + 2);
        }
        this.edges = new Uint16Array(edges);

        super.colorVertices();
        super.colorEdges();
        this.center = new Matrix().scale(0.5, 0.5, 0.5);

        /**
         * Finds the midpoint between two points (vertices)
         * The midpoint is calculated by getting the x, y, z coordinates and dividing by 2
         * @param {Vector} A The first vertex
         * @param {Vector} B The second vertex
         * @returns {Vector} A vector value for the midpoint between the two vertices
         */
        function findMidpoint(A, B) {
            let x = (A.getX() + B.getX()) / 2;
            let y = (A.getY() + B.getY()) / 2;
            let z = (A.getZ() + B.getZ()) / 2;
            return new Vector([x, y, z]);
        }
    }

    /**
	 * Creates the program and buffers the data
	 * @param {WebGLRenderingContext} gl webGL Context
	 */
    bufferData(gl) {
        super.bufferData(gl);
        this.program = createProgram(gl, vertex, fragment);
    }

    /**
	 * Renders the sphere shape
	 * @param {WebGLRenderingContext} gl webGL context
	 * @param {Matrix} projection Projection of the sphere
	 * @param {Matrix} view View of the sphere
	 */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // Gets the attribute and uniform location data
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
        }

        // Edges buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.vertexAttribPointer(colorsLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorsLoc);

        // Draws the edges using LINES
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_SHORT, 0);
    }
}
