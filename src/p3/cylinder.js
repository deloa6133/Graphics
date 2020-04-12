/* global  Shape createProgram vertex fragment Matrix */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Cylinder" }] */

/**
 * Cylinder class that extends Shape class to create a cylinder with scale 1
 * @author Adam G. Delo
 */
class Cylinder extends Shape {
    /**
	 * Cylinder Contructor
	 * @param {number} sides Number of sides on the cylinder
	 */
    constructor(sides) {
        super();

        // Creates the vertices array for the cylinder
        let vertices = [];
        // Create the bottom circle
        // Given a radius of 0.5
        let radius = 0.5;
        for (let i = 0; i < sides; i++) {
            vertices.push(radius * Math.cos(i / sides * 2.0 * Math.PI));
            vertices.push(0);
            vertices.push(radius * Math.sin(i / sides * 2.0 * Math.PI));
        }
        // Create the top circle
        for (let i = sides - 1; i >= 0; i--) {
            vertices.push(radius * Math.cos(i / sides * 2.0 * Math.PI));
            vertices.push(1);
            vertices.push(radius * Math.sin(i / sides * 2.0 * Math.PI));
        }

        this.vertices = new Float32Array(vertices);

        // Creates the triangles array for the cylinder
        let triangles = [];
        // Triangles for the top and bottom circles
        for (let i = 0; i < sides * 2; i++) {
            triangles.push(i);
        }
        // Triangles for the side of the cylinder
        for (let i = 0; i < sides; i++) {
            triangles.push(i);
            triangles.push(sides * 2 - i - 1);
        }
        triangles.push(0);
        triangles.push(sides * 2 - 1);

        this.triangles = new Uint8Array(triangles);

        // Creates the edges array for the cylinder
        let edges = [];
        // Bottom edges
        for (let i = 0; i < sides; i++) {
            edges.push(i);
            edges.push(i + 1);
        }
        edges.pop();
        edges.push(0);
        // Top edges
        for (let i = sides; i < sides * 2; i++) {
            edges.push(i);
            edges.push(i + 1);
        }
        edges.pop();
        edges.push(sides);
        // Side edges
        for (let i = 0; i < sides; i++) {
            edges.push(i);
            edges.push(sides * 2 - 1 - i);
        }
        edges.push(0);
        this.edges = new Uint8Array(edges);

        // Gives the vertices and edges color
        super.colorVertices();
        super.colorEdges();

        // Set the scale of the cylinder to be 1/2 of original to scale to 1
        // Translate cylinder to center on origin
        this.center = new Matrix().translate(0, -0.25, 0).scale(0.5, 0.5, 0.5);
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
	 * Renders the cylinder shape
	 * @param {WebGLRenderingContext} gl webGL context
	 * @param {Matrix} projection Current projection of the cylinder
	 * @param {Matrix} view Current view
	 */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // Get the attribute and uniform location information
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

        // Start the program to be used
        gl.useProgram(this.program);

        // Gets the data from the buffers
        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniformMatrix4fv(matView, false, view.getData());

        // Draw the cylinder using TRIANGLE_FAN for top and bottom and TRIANGLE_STRIP for sides
        if (!this.wire) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
            gl.drawElements(gl.TRIANGLE_FAN, (this.triangles.length - 2) / 4, gl.UNSIGNED_BYTE, 0);
            gl.drawElements(gl.TRIANGLE_FAN, (this.triangles.length - 2) / 4, gl.UNSIGNED_BYTE, (this.triangles.length - 2) / 4);
            gl.drawElements(gl.TRIANGLE_STRIP, (this.triangles.length - 2) / 2 + 2, gl.UNSIGNED_BYTE, (this.triangles.length - 2) / 2);
        }

        // Edges buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.vertexAttribPointer(colorsLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorsLoc);

        // Draws the Edges using LINES
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }
}
