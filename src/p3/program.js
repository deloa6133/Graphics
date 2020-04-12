/* eslint no-unused-vars: ["warn", {"varsIgnorePattern": "createProgram"}] */

/**
 * @author Adam G. Delo
 */

/**
 * Creates the shader
 * @param {WebGLRenderingContext} gl WebGL context
 * @param {string} source Shader source code
 * @param {number} type Shader type
 *
 * @return {WebGLShader} Shader created from the loading of shader
 */
function loadShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

/**
 * Creates a program that uses the vertex and fragment shaders
 * @param {WebGLRenderingContext} gl WebGL context
 * @param {string} vertexScr Vertex shader
 * @param {string} fragScr Fragment shader
 *
 * @return {WebGLProgram} Program created using the shaders
 */
function createProgram(gl, vertexScr, fragScr) {
    const vertex = loadShader(gl, vertexScr, gl.VERTEX_SHADER);
    const frag = loadShader(gl, fragScr, gl.FRAGMENT_SHADER);

    const prog = gl.createProgram();
    gl.attachShader(prog, vertex);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.deleteProgram(prog);

        return null;
    }

    return prog;
}
