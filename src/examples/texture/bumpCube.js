/* global Matrix createProgram */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "BumpCube" }] */

/**
 * vertex shader
 */
const bumpCubeVertex = `
    precision mediump float;

    attribute vec4 cubeLocation;
    attribute vec2 textureCoord; 
    attribute vec3 normal;
    attribute vec3 tangent;   

    uniform vec3 lightPos; // location of a distance light source
    
    uniform mat4 view;
    uniform mat4 model;
    uniform mat4 projection;
    uniform mat4 inverse;

    varying vec2 texPos;

    varying vec3 texLight; // light source in tangent space coords
    varying vec3 texLoc;
    // would need viewer in tangent coords too if doing specular light


    // taken from http://apoorvaj.io/exploring-bump-mapping-with-webgl.html
    mat3 transpose(in mat3 inMatrix)
    {
        vec3 i0 = inMatrix[0];
        vec3 i1 = inMatrix[1];
        vec3 i2 = inMatrix[2];
    
        mat3 outMatrix = mat3(
            vec3(i0.x, i1.x, i2.x),
            vec3(i0.y, i1.y, i2.y),
            vec3(i0.z, i1.z, i2.z)
        );
    
        return outMatrix;
    }

    void main() {
       gl_Position = projection * view * model * cubeLocation;

       vec3 n = normalize(inverse * vec4(normal, 0.0)).xyz;
       vec3 t = normalize(inverse * vec4(tangent, 0.0)).xyz;
       vec3 b = cross(n, t);

       mat3 tbn = transpose(mat3(t, b, n));

       texPos = textureCoord;   
       texLight = tbn * lightPos;
       texLoc = cubeLocation.xyz;
    }

`;


/**
 * fragment shader
 */
const bumpCubeFragment = `
    precision mediump float;
    varying vec2 texPos;

    varying vec3 texLight; // light source in tangent space coords
    varying vec3 texLoc;

    uniform sampler2D sample;
    uniform sampler2D bumpSample;
    
    void main() {
        vec3 lightDir = normalize(texLight - texLoc);
        vec4 baseColor = texture2D(sample, texPos);
        vec4 ambient =  0.3 * baseColor;

        vec3 norm = normalize(texture2D(bumpSample, texPos) * 2.0 - 1.0).xyz;
        float diffuse = max(dot(lightDir, norm), 0.0);

        gl_FragColor = diffuse * baseColor + ambient;
        gl_FragColor.a = 1.0;
    }
`;

/**
 * Creates a cube centered on the origin with a size of 0.5 units. The cube is
 * shaded to show the color gamut.
 */
class BumpCube {
    /**
     * Creates a cube.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        // shaders
        this.wire = false;
        this.program = createProgram(gl, bumpCubeVertex, bumpCubeFragment);

        this.vertices = new Float32Array([
            // VVV NNN TTT XX
            // bottom
            0, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, // 0
            1, 0, 0, 0, -1, 0, -1, 0, 0, 1, 0, // 1
            0, 0, 1, 0, -1, 0, -1, 0, 0, 0, 1, // 3
            1, 0, 1, 0, -1, 0, -1, 0, 0, 1, 1, // 5
            // front
            0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, // 3
            1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, // 5
            0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, // 6
            1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, // 7
            // top
            0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, // 6
            1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, // 7
            0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, // 2
            1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, // 4
            // back
            0, 1, 0, 0, 0, -1, -1, 0, 0, 0, 0, // 2
            1, 1, 0, 0, 0, -1, -1, 0, 0, 1, 0, // 4
            0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 1, // 0
            1, 0, 0, 0, 0, -1, -1, 0, 0, 1, 1, // 1
            // right
            1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, // 1
            1, 1, 0, 1, 0, 0, 0, 0, -1, 1, 0, // 4
            1, 0, 1, 1, 0, 0, 0, 0, -1, 0, 1, // 5
            1, 1, 1, 1, 0, 0, 0, 0, -1, 1, 1, // 7
            // left
            0, 1, 1, -1, 0, 0, 0, 0, 1, 0, 0, // 6
            0, 1, 0, -1, 0, 0, 0, 0, 1, 1, 0, // 2
            0, 0, 1, -1, 0, 0, 0, 0, 1, 0, 1, // 3
            0, 0, 0, -1, 0, 0, 0, 0, 1, 1, 1 // 0
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
     * @param {String} filename File name
     * @param {Number} textureNum texture number
     */
    createTexture(gl, filename, textureNum) {
        // TODO create and bind texture
        let texture = gl.createTexture();
        gl.activeTexture(textureNum);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // TODO create temp texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
            gl.UNSIGNED_BYTE, new Uint8Array([0, 1, 0, 1]));

        // TODO load image with onload callback
        let img = new Image();

        img.onload = () => {
            gl.activeTexture(textureNum);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE, img);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        };

        img.src = filename;

        return texture;
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

        // TODO add this back in
        this.normalTexture = this.createTexture(gl, "texture4.jpg", gl.TEXTURE3);
        this.bumpTexture = this.createTexture(gl, "bump6.png", gl.TEXTURE4);

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
        let verNormal = gl.getAttribLocation(this.program, "normal");
        let verTangent = gl.getAttribLocation(this.program, "tangent");
        let matProjection = gl.getUniformLocation(this.program, "projection");
        let matView = gl.getUniformLocation(this.program, "view");
        let matModel = gl.getUniformLocation(this.program, "model");
        let light = gl.getUniformLocation(this.program, "lightPos");
        let inverse = gl.getUniformLocation(this.program, "inverse");

        let texLoc = gl.getAttribLocation(this.program, "textureCoord");
        let sample = gl.getUniformLocation(this.program, "sample");
        let bumpSample = gl.getUniformLocation(this.program, "bumpSample");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 44, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verNormal, 3, gl.FLOAT, false, 44, 12);
        gl.enableVertexAttribArray(verNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verTangent, 3, gl.FLOAT, false, 44, 24);
        gl.enableVertexAttribArray(verTangent);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 44, 36);
        gl.enableVertexAttribArray(texLoc);

        gl.useProgram(this.program);

        gl.uniform1i(sample, 3);
        gl.uniform1i(bumpSample, 4); // TODO add in
        gl.uniform3fv(light, [1, 2, 0]);

        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matView, false, view.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniformMatrix4fv(inverse, false, this.matrixInverse(this.getModel()).getData());

        if (!this.wire) {
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, this.normalTexture);
            gl.activeTexture(gl.TEXTURE4);
            gl.bindTexture(gl.TEXTURE_2D, this.bumpTexture);
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


    // taken from http://apoorvaj.io/assets/bump_mapping/bump_mapping.js
    matrixInverse(mat) {
        // transpose this so it is row-major.
        let m = new Matrix(mat.getData()).getData();
        let inv = [0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0];

        inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

        if (det === 0) {
            console.log("Error: Non-invertible matrix");
            return [0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0];
        }

        det = 1.0 / det;
        for (var i = 0; i < 16; i++) {
            inv[i] *= det;
        }
        // transpose the inverse
        return new Matrix(new Matrix(inv).getData());
    }

}
