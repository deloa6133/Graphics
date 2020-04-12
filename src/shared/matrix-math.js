/**
 * @author Adam Delo
 */

/* eslint no-unused-vars: ["warn", {"varsIgnorePattern": "(Matrix)|(Vector)"}] */

/**
 * Represents a 4x4 matrix suitable for performing transformations
 * on a vector of homogeneous coordinates.
 */
class Matrix {
    /**
     * Creates a 4x4 matrix. If no parameter is given, the identity
     * matrix is created. If values is provided it should be an array
     * and it will provide UP TO 16 values for the matrix. If there are
     * less than 16 values, the remaining values in the array should
     * correspond to the identify matrix. If there are more than 16,
     * the rest should be ignored.
     *
     * The data is assumed to be in COLUMN MAJOR order.
     *
     * IMPORTANT NOTE: The values array will be in ROW MAJOR order
     * because that makes the most sense for people when they are
     * entering data. This array will need to be transposed so that
     * it is in COLUMN MAJOR order.
     *
     * As an example, when creating a Matrix object, the user may do
     * something like:
     *      m = new Matrix([1, 2, 3, 4,
     *                      5, 6, 7, 8,
     *                      9, 10, 11, 12,
     *                      13, 14, 15, 16]);
     *
     * This gives the constructor an array with values:
     *      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
     * (since it is in ROW MAJOR order).
     *
     * The data in the array needs to be reordered so that it is,
     * logically, in COLUMN MAJOR order. The resulting array should
     * be:
     *      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]
     *
     * To see if values was passed to the function, you can check if
     *      typeof values !== "undefined"
     * This will be true if values has a value.
     *
     * @param {number[]} values (optional) An array of floating point values.
     *
     */
    constructor(values) {
        this.matrix =
        [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];

        if (typeof values !== "undefined") {
            for (let i = 0; i < 16 && i < values.length; i++) {
                this.setValue(Math.floor(i / 4), i % 4, values[i]);
            }
        }
    }

    /**
     * Returns a Float32Array array with the data from the matrix. The
     * data should be in COLUMN MAJOR form.
     *
     * @return {Float32Array} Array with the matrix data.
     */
    getData() {
        return new Float32Array(this.matrix);
    }

    /**
     * Gets a value from the matrix at position (r, c).
     *
     * @param {number} r Row number (0-3) of value in the matrix.
     * @param {number} c Column number (0-3) of value in the matrix.
     */
    getValue(r, c) {
        return this.matrix[r + c * 4];
    }

    /**
     * Updates a single position (r, c) in the matrix with value.
     *
     * @param {number} r Row number (0-3) of value in the matrix.
     * @param {number} c Column number (0-3) of value in the matrix.
     * @param {number} value Value to place in the matrix.
     */
    setValue(r, c, value) {
        this.matrix[r + c * 4] = value;
    }

    /**
     * Resets the matrix to be the identity matrix.
     * @return {Matrix} Returns the identity matrix.
     */
    identity() {
        let identity = new Matrix(new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]));

        return identity;
    }

    /**
     * Multiplies the current matrix by the parameter matrix and returns the result.
     * This operation should not change the current matrix or the parameter.
     *
     * @param {Matrix} matB Matrix to post-multiply the current matrix by.
     *
     * @return {Matrix} Product of the current matrix and the parameter.
     */
    mult(matB) {
        let result = new Matrix();

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                result.setValue(r, c, this.getValue(r, 0) * matB.getValue(0, c) +
                    this.getValue(r, 1) * matB.getValue(1, c) +
                    this.getValue(r, 2) * matB.getValue(2, c) +
                    this.getValue(r, 3) * matB.getValue(3, c));
            }
        }
        return result;
    }


    /**
     * Creates a new Matrix that is the current matrix translated by
     * the parameters.
     *
     * This should not change the current matrix.
     *
     * @param {number} x Amount to translate in the x direction.
     * @param {number} y Amount to translate in the y direction.
     * @param {number} z Amount to translate in the z direction.
     *
     * @return {Matrix} Result of translating the current matrix.
     */
    translate(x, y, z) {
        let t = new Matrix();
        t.matrix[12] = x;
        t.matrix[13] = y;
        t.matrix[14] = z;

        return this.mult(t);
    }

    /**
     * Rotatation around the x-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the x-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateX(theta, x = 0, y = 0, z = 0) {
        return this.rotate(theta, 0, 0, x, y, z);
    }

    /**
     * Rotatation around the y-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the y-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateY(theta, x = 0, y = 0, z = 0) {
        return this.rotate(0, theta, 0, x, y, z);
    }

    /**
     * Rotatation around the z-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the z-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateZ(theta, x = 0, y = 0, z = 0) {
        return this.rotate(0, 0, theta, x, y, z);
    }

    /**
     * Rotatation around the z-axis followed by a rotation around the y-axis and then
     * the z-axis. If provided, the rotation is done around the point (x, y, z).
     * By default, that point is the origin.
     *
     * The rotation must be done in order z-axis, y-axis, x-axis.
     *
     * This should not change the current matrix.
     *
     * @param {number} thetax Amount in DEGREES to rotate around the x-axis.
     * @param {number} thetay Amount in DEGREES to rotate around the y-axis.
     * @param {number} thetaz Amount in DEGREES to rotate around the z-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotate(thetax, thetay, thetaz, x = 0, y = 0, z = 0) {
        let rx = new Matrix();
        let cosx = Math.cos(thetax / 180 * Math.PI);
        let sinx = Math.sin(thetax / 180 * Math.PI);
        rx.matrix[5] = cosx;
        rx.matrix[9] = -sinx;
        rx.matrix[6] = sinx;
        rx.matrix[10] = cosx;

        let ry = new Matrix();
        let cosy = Math.cos(thetay / 180 * Math.PI);
        let siny = Math.sin(thetay / 180 * Math.PI);
        ry.matrix[10] = cosy;
        ry.matrix[2] = -siny;
        ry.matrix[8] = siny;
        ry.matrix[0] = cosy;

        let rz = new Matrix();
        let cosz = Math.cos(thetaz / 180 * Math.PI);
        let sinz = Math.sin(thetaz / 180 * Math.PI);
        rz.matrix[0] = cosz;
        rz.matrix[4] = -sinz;
        rz.matrix[1] = sinz;
        rz.matrix[5] = cosz;

        return this.translate(x, y, z).mult(rx).mult(ry).mult(rz).translate(-x, -y, -z);
    }

    /**
     * Scaling relative to a point. If provided, the scaling is done relative to
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} sx Amount to scale in the x direction.
     * @param {number} sy Amount to scale in the y direction.
     * @param {number} sz Amount to scale in the z direction.
     * @param {number} x x coordinate of the point around which to scale. Defaults to 0.
     * @param {number} y y coordinate of the point around which to scale. Defaults to 0.
     * @param {number} z z coordinate of the point around which to scale. Defaults to 0.
     *
     * @return {Matrix} Result of scaling the current matrix.
     */
    scale(sx, sy, sz, x = 0, y = 0, z = 0) {
        let tempMatrix = new Matrix([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
        return this.translate(x, y, z).mult(tempMatrix).translate(-x, -y, -z);
    }

    /**
     * Prints the matrix as an HTML table.
     *
     * @return {string} HTML table with the contents of the matrix.
     */
    asHTML() {
        let output = "<table>";
        for (let r = 0; r < 4; r++) {
            output += "<tr>";
            for (let c = 0; c < 4; c++) {
                output += "<td>" + this.getValue(r, c).toFixed(2) + "</td>";
            }
            output += "</tr>";
        }
        output += "</table>";
        return output;
    }
}


/**
 * Represents a vector in 3d space.
 */
class Vector {
    /**
     * Creates a vector. If no parameter is given, the vector is set to
     * all 0's. If values is provided it should be an array
     * and it will provide UP TO 3 values for the vector. If there are
     * less than 3 values, the remaining values in the array should
     * set to 0. If there are more than 3, the rest should be ignored.
     *
     * To see if values was passed to the function, you can check if
     *      typeof values !== "undefined"
     * This will be true if values has a value.
     *
     * @param {number[]} values (optional) An array of floating point values.
     *
     */
    constructor(values) {
        this.data = new Float32Array([0, 0, 0, 0]);

        if (typeof values !== "undefined") {
            for (let i = 0; i < values.length && i < 3; i++) {
                this.data[i] = values[i];
            }
        }
    }

    /**
     * Calculates the cross product of the current vector and the parameter.
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to cross with the current vector.
     *
     * @return {Vector} The cross product of the current vector and the parameter.
     */
    crossProduct(v) {
        return new Vector([
            this.data[1] * v.data[2] - this.data[2] * v.data[1],
            this.data[2] * v.data[0] - this.data[0] * v.data[2],
            this.data[0] * v.data[1] - this.data[1] * v.data[0]
        ]);
    }

    /**
     * Calculates the dot product of the current vector and the parameter.
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to dot with the current vector.
     *
     * @return {number} The dot product of the current vector and the parameter.
     */
    dotProduct(v) {
        return this.data[0] * v.data[0] +
            this.data[1] * v.data[1] +
            this.data[2] * v.data[2];
    }

    /**
     * Adds two Vectors (the current Vector and the parameter)
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to add with the current vector.
     *
     * @return {number} The sum of the current vector and the parameter.
     */
    add(v) {
        let vector = new Vector;
        for (let i = 0; i < this.data.length && i < v.data.length; i++) {
            vector.data[i] = this.data[i] + v.data[i];
        }
        return vector;
    }

    /**
     * Subtracts two Vectors (the current Vector and the parameter)
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to subtract from the current vector.
     *
     * @return {number} The difference of the current vector and the parameter.
     */
    subtract(v) {
        let vector = new Vector;
        for (let i = 0; i < this.data.length && i < v.data.length; i++) {
            vector.data[i] = this.data[i] - v.data[i];
        }
        return vector;
    }

    /**
     * Normalizes the current vector so that is has a
     * length of 1. The result is returned as a new
     * Matrix.
     *
     * This should not change the current vector.
     *
     * @return {Vector} A normalized vector with the same
     * direction as the current vector.
     */
    normalize() {
        let v = new Vector(this.data);
        let len = this.length();
        if (len === 0) {
            return v;
        } else {
            for (let i = 0; i < 3; i++) {
                v.data[i] /= len;
            }
            return v;
        }
    }

    /**
     * Gets the length (magnitude) of the current vector.
     *
     * @return {number} The length of the current vector.
     */
    length() {
        return Math.sqrt(this.data[0] * this.data[0] +
            this.data[1] * this.data[1] +
            this.data[2] * this.data[2]);
    }

    /**
     * Scales the current vector by amount s and returns a
     * new Vector that is the result.
     *
     * This should not change the current vector.
     *
     * @param {number} s Amount to scale the vector.
     *
     * @returns {Vector} A new vector that is the result
     * of the current vector scaled by the parameter.
     */
    scale(s) {
        let v = this.data;
        for (let i = 0; i < 3; i++) {
            v[i] *= s;
        }
        return v;
    }

    /**
     * Returns the x value of the vector.
     *
     * @return {number} The x value of the vector.
     */
    getX() {
        return this.data[0];
    }

    /**
     * Returns the y value of the vector.
     *
     * @return {number} The y value of the vector.
     */
    getY() {
        return this.data[1];
    }

    /**
     * Returns the z value of the vector.
     *
     * @return {number} The z value of the vector.
     */
    getZ() {
        return this.data[2];
    }

    /**
     * Returns a Float32Array with the contents of the vector. The
     * data in the vector should be in the order [x, y, z, w]. This
     * makes it suitable for multiplying by a 4x4 matrix.
     *
     * The w value should always be 0.
     *
     * @return {Float32Array} The vector as a 4 element array.
     */
    getData() {
        return this.data;
    }
}

/**
 * Camera class that holdes the views of the camera as well as the projection matrices
 * Contains an orthographic projection as well as a frustum projection
 * Lookat and Viewpoint are calculated
 */
class Camera {
    // Constructor creates two matrices; The projection matrix, and camera view
    // The matrices are set to the identity Matrix initially
    constructor() {
        this.projMatrix = new Matrix();
        this.camView = new Matrix();
    }

    /**
     * @return {Matrix} Returns the view matrix
     */
    getView() {
        return this.camView;
    }

    /**
     * @return {Matrix} Returns the projection matrix
     */
    getProjection() {
        return this.projMatrix;
    }

    /**
     * @param {number} left The left value of the ortho view
     * @param {number} right The right value of the ortho view
     * @param {number} bottom The bottom value of the ortho view
     * @param {number} top The top value of the ortho view
     * @param {number} near The near value of the ortho view
     * @param {number} far The far value of the ortho view
     * @return {Matrix} Returns the perspectiveMatrix variable which is set to the projection matrix
     */
    ortho(left, right, bottom, top, near, far) {
        let perspectiveMatrix = new Matrix([
            2 / (right - left), 0, 0, -((left + right) / (right - left)),
            0, 2 / (top - bottom), 0, -((top + bottom) / (top - bottom)),
            0, 0, -2 / (far - near), -((far + near) / (far - near)),
            0, 0, 0, 1]);
        this.projMatrix = perspectiveMatrix;
        return perspectiveMatrix;
    }

    /**
     * @param {number} left The left value of the ortho view
     * @param {number} right The right value of the ortho view
     * @param {number} bottom The bottom value of the ortho view
     * @param {number} top The top value of the ortho view
     * @param {number} near The near value of the ortho view
     * @param {number} far The far value of the ortho view
     * @return {Matrix} Returns the frustumMatrix which is set from the projection matrix
     */
    frustum(left, right, bottom, top, near, far) {
        let frustumMatrix = new Matrix([
            2 * near / (right - left), 0, (right + left) / (right - left), 0,
            0, 2 * near / (top - bottom), (top + bottom) / (top - bottom), 0,
            0, 0, (-far + near) / (far - near), -2 * (far * near) / (far - near),
            0, 0, -1, 0]);
        this.projMatrix = frustumMatrix;
        return frustumMatrix;
    }

    /**
     * @param {Vector} eyeLoc The location of the eye
     * @param {Vector} lookLoc The lcoation that is being looked at
     * @param {Vector} upVec The up vector
     * @return {Matrix} Returns the camera view matrix which is set to the lookat matrix
     */
    lookAt(eyeLocation, lookedAt, upVector) {
        // Declares new vectors n, u, and v
        let n = new Vector();
        let u = new Vector();
        let v = new Vector();

        // Calculates the n, u, and v vectors
        n = eyeLocation.subtract(lookedAt);
        u = upVector.crossProduct(n);
        v = n.crossProduct(u);

        // Normalizes the n, u, and v vectors
        n = n.normalize();
        u = u.normalize();
        v = v.normalize();

        // Sets the data as a new lookat matrix with the x, y, and z data from n, y, and v
        this.look = new Matrix([
            u.data[0], u.data[1], u.data[2], 0,
            v.data[0], v.data[1], v.data[2], 0,
            n.data[0], n.data[1], n.data[2], 0,
            0, 0, 0, 1
        ]);

        // Translates the matrix to give the final lookat matrix to be set to the camView
        this.camView = this.look.translate(-eyeLocation.getX(), -eyeLocation.getY(), -eyeLocation.getZ());
        // Returns the matrix
        return this.camView;
    }


    /**
     * @param {Vector} camLoc The location of the camera
     * @param {Vector} viewNormal The view normal vector of the camera
     * @param {Vector} upVector The up vector
     * @return {Matrix} Returns the camera view matrix which is set to the view point matrix
     */
    viewPoint(camLoc, viewNormal, upVector) {
        // Declares new vectors n, u, and v
        let n = new Vector();
        let u = new Vector();
        let v = new Vector();

        // Calculates and normalizes the n, u, and v vectors
        n = viewNormal;
        n = n.normalize();
        let alpha = upVector.dotProduct(n);
        v = upVector.subtract(n.scale(alpha));
        v = v.normalize();
        u = v.crossProduct(n);
        u = u.normalize();

        // Sets the view matrix to the data given from the x, y, and z from n, u, and v
        this.viewMat = new Matrix([
            u.getX(), u.getY(), u.getZ(), 0,
            v.getX(), v.getY(), v.getZ(), 0,
            n.getX(), n.getY(), n.getZ(), 0,
            0, 0, 0, 1]);

        // Translates the view matrix to give the final camera view matrix
        this.camView = this.viewMat.translate(-camLoc.getX(), -camLoc.getY(), -camLoc.getZ());
        // Returns the matrix
        return this.camView;
    }
}

// allows the class to be sent during testing
module.exports = {
    Camera: Camera,
    Matrix: Matrix,
    Vector: Vector
};
