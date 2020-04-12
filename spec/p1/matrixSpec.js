/**
 * @author Adam Delo
 */

// allows Matrix to be found
var Matrix = require("../../src/shared/matrix-math").Matrix;

/**
 *
 * @param {Matrix} mat Matrix to test
 * @param {Array} expected Array with the expected results
 */
function testMatrix(mat, expected) {

    expect(mat.getData().length).toBe(16);
    let data = mat.getData();
    for (let i = 0; i < 16; i++) {
        expect(data[i]).toBeCloseTo(expected[i], 3,
            " Actual: " + data + " Expected: " + expected);
    }
}


describe("Matrix Constructor", function() {
    // Test to create a new identitiy of the matrix
    // Sets the matrix back to the identity matrix
    it("Matrix - Identity", function() {
        testMatrix(new Matrix, [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
    });

    // Test to determine the array information
    it("Matrix - Array", function() {
        let data = new Matrix([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        ]);
        testMatrix(data, [1, 5, 9, 13,
            2, 6, 10, 14,
            3, 7, 11, 15,
            4, 8, 12, 16
        ]);
    });

    // Test to multiply one matrix with another
    it("Matrix - multMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        let data2 = new Matrix([
            5, 2, 0, 0,
            0, 2, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 3
        ]);
        data = data.mult(data2);
        testMatrix(data, new Matrix([
            5, 2, 0, 0,
            0, 2, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 3
        ]).getData());
    });

    // Second test to multiply one matrix with another
    it("Matrix - multMatrix2", function() {
        let data = new Matrix([
            1, 0, 3, 3,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        let data2 = new Matrix([
            5, 2, 4, 0,
            0, 2, 0, 0,
            0, 2, 1, 0,
            0, 0, 0, 3
        ]);
        data = data.mult(data2);
        testMatrix(data, new Matrix([
            5, 8, 7, 9,
            0, 2, 0, 0,
            0, 2, 1, 0,
            0, 0, 0, 3
        ]).getData());
    });

    // Third test to multiply one matrix with another
    it("Matrix - multMatrix3", function() {
        let data = new Matrix([
            4, 0, 3, 3,
            0, 1, 0, 0,
            2, 6, 1, 0,
            2, 10, 0, 1
        ]);
        let data2 = new Matrix([
            5, 2, 4, 0,
            0, 2, 7, 8,
            0, 2, 1, 9,
            0, 0, 0, 3
        ]);
        data = data.mult(data2);
        testMatrix(data, new Matrix([
            20, 14, 19, 36,
            0, 2, 7, 8,
            10, 18, 51, 57,
            10, 24, 78, 83
        ]).getData());
    });

    // Test to translate a matrix to a new location
    it("Matrix - translateMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.translate(2, 3, 4);
        testMatrix(data, new Matrix([
            1, 0, 0, 2,
            0, 1, 0, 3,
            0, 0, 1, 4,
            0, 0, 0, 1
        ]).getData());
    });

    // Second test to translate a matrix to a new location
    it("Matrix - translateMatrix2", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.translate(5, 3, 1);
        testMatrix(data, new Matrix([
            1, 0, 0, 5,
            0, 1, 0, 3,
            0, 0, 1, 1,
            0, 0, 0, 1
        ]).getData());
    });

    // Third test to translate a matrix to a new location
    it("Matrix - translateMatrix3", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.translate(9, 1, 2);
        testMatrix(data, new Matrix([
            1, 0, 0, 9,
            0, 1, 0, 1,
            0, 0, 1, 2,
            0, 0, 0, 1
        ]).getData());
    });

    // Test to scale a matrix by a set of values
    it("Matrix - scaleMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.scale(4, 4, 4, 0, 0, 0);
        testMatrix(data, new Matrix([
            4, 0, 0, 0,
            0, 4, 0, 0,
            0, 0, 4, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Second test to scale a matrix by a set of values
    it("Matrix - scaleMatrix2", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.scale(5, 3, 7, 0, 0, 0);
        testMatrix(data, new Matrix([
            5, 0, 0, 0,
            0, 3, 0, 0,
            0, 0, 7, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Third test to scale a matrix by a set of values
    it("Matrix - scaleMatrix3", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.scale(7, 22, 0, 0, 0, 0);
        testMatrix(data, new Matrix([
            7, 0, 0, 0,
            0, 22, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Test to rotate the matrix on the x axis
    it("Matrix - rotateXMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateX(20, 0, 0, 0);
        let radians = 20 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            1, 0, 0, 0,
            0, cos, -sin, 0,
            0, sin, cos, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Second test to rotate the matrix on the x axis
    it("Matrix - rotateXMatrix2", function() {
        let data = new Matrix([
            3, 0, 0, 2,
            0, 1, 0, 4,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateX(70, 0, 0, 0);
        let radians = 70 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            3, 0, 0, 2,
            0, cos, -sin, 4,
            0, sin, cos, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Third test to rotate the matrix on the x axis
    it("Matrix - rotateXMatrix3", function() {
        let data = new Matrix([
            5, 0, 0, 2,
            0, 1, 0, 4,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateX(2, 0, 0, 0);
        let radians = 2 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            5, 0, 0, 2,
            0, cos, -sin, 4,
            0, sin, cos, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Test to rotate the matrix on the y axis
    it("Matrix - rotateYMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateY(30, 0, 0, 0);
        let radians = 30 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, 0, sin, 0,
            0, 1, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Second test to rotate the matrix on the y axis
    it("Matrix - rotateYMatrix2", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 4, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 5
        ]);
        data = data.rotateY(25, 0, 0, 0);
        let radians = 25 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, 0, sin, 0,
            0, 4, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 5
        ]).getData());
    });

    // Third test to rotate the matrix on the y axis
    it("Matrix - rotateYMatrix3", function() {
        let data = new Matrix([
            1, 0, 0, 4,
            0, 2, 0, 3,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateY(65, 0, 0, 0);
        let radians = 65 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, 0, sin, 4,
            0, 2, 0, 3,
            -sin, 0, cos, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Test to rotate the matrix on the z axis
    it("Matrix - rotateZMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateZ(10, 0, 0, 0);
        let radians = 10 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Second test to rotate the matrix on the z axis
    it("Matrix - rotateZMatrix2", function() {
        let data = new Matrix([
            1, 0, 0, 4,
            0, 1, 0, 3,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotateZ(27, 0, 0, 0);
        let radians = 27 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, -sin, 0, 4,
            sin, cos, 0, 3,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]).getData());
    });

    // Third test to rotate the matrix on the z axis
    it("Matrix - rotateZMatrix3", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 6,
            0, 0, 5, 3,
            0, 0, 0, 2
        ]);
        data = data.rotateZ(80, 0, 0, 0);
        let radians = 80 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        testMatrix(data, new Matrix([
            cos, -sin, 0, 0,
            sin, cos, 0, 6,
            0, 0, 5, 3,
            0, 0, 0, 2
        ]).getData());
    });

    // Test to rotate the matrix on the x, y, and z axis
    it("Matrix - rotateMatrix", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data = data.rotate(20, 40, 5, 0, 0, 0);
        let radianX = 20 * Math.PI / 180;
        let radianY = 40 * Math.PI / 180;
        let radianZ = 5 * Math.PI / 180;
        data = data.rotateX(radianX);
        data = data.rotateY(radianY);
        data = data.rotateZ(radianZ);
        return data;
    });

    // Second test to rotate the matrix on the x, y, and z axis
    it("Matrix - rotateMatrix2", function() {
        let data = new Matrix([
            1, 2, 0, 0,
            0, 4, 0, 0,
            0, 0, 1, 0,
            0, 5, 6, 1
        ]);
        data = data.rotate(20, 40, 5, 0, 0, 0);
        let radianX = 45 * Math.PI / 180;
        let radianY = 2 * Math.PI / 180;
        let radianZ = 79 * Math.PI / 180;
        data = data.rotateX(radianX);
        data = data.rotateY(radianY);
        data = data.rotateZ(radianZ);
        return data;
    });

    // Third test to rotate the matrix on the x, y, and z axis
    it("Matrix - rotateMatri3", function() {
        let data = new Matrix([
            1, 0, 0, 4,
            0, 1, 4, 2,
            0, 0, 6, 1,
            0, 0, 0, 1
        ]);
        data = data.rotate(20, 40, 5, 0, 0, 0);
        let radianX = 13 * Math.PI / 180;
        let radianY = 10 * Math.PI / 180;
        let radianZ = 4 * Math.PI / 180;
        data = data.rotateX(radianX);
        data = data.rotateY(radianY);
        data = data.rotateZ(radianZ);
        return data;
    });

    // Test to get the data from a matrix and return that data
    it("Matrix - getData", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data.getData();
    });

    // Second test to get the data from a matrix and return that data
    it("Matrix - getData2", function() {
        let data = new Matrix([
            1, 2, 0, 0,
            0, 1, 0, 0,
            5, 0, 1, 0,
            0, 3, 0, 1
        ]);
        data.getData();
    });

    // Third test to get the data from a matrix and return that data
    it("Matrix - getData3", function() {
        let data = new Matrix([
            1, 3, 0, 7,
            0, 2, 0, 9,
            0, 0, 5, 1,
            0, 0, 0, 1
        ]);
        data.getData();
    });

    // Test to get the value of a matrix and return it
    it("Matrix - getValue", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data.getValue();
    });

    // Second test to get the value of a matrix and return it
    it("Matrix - getValue2", function() {
        let data = new Matrix([
            1, 2, 4, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            2, 0, 5, 1
        ]);
        data.getValue();
    });

    // Third test to get the value of a matrix and return it
    it("Matrix - getValue3", function() {
        let data = new Matrix([
            1, 0, 0, 7,
            0, 1, 0, 9,
            0, 0, 1, 3,
            0, 0, 0, 4
        ]);
        data.getValue();
    });

    // Test to set the value of a matrix
    it("Matrix - setValue", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data.setValue();
    });

    // Second test to set the value of a matrix
    it("Matrix - setValue2", function() {
        let data = new Matrix([
            1, 2, 0, 0,
            0, 1, 0, 0,
            0, 4, 5, 6,
            0, 0, 0, 1
        ]);
        data.setValue();
    });

    // Third test to set the value of a matrix
    it("Matrix - setValue3", function() {
        let data = new Matrix([
            1, 7, 8, 9,
            0, 1, 0, 10,
            0, 0, 1, 0,
            6, 0, 0, 21
        ]);
        data.setValue();
    });

    // Test to display the information of a matrix in html table format
    it("Matrix - asHTML", function() {
        let data = new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        data.asHTML();
    });

    // Second test to display the information of a matrix in html table format
    it("Matrix - asHTML2", function() {
        let data = new Matrix([
            6, 2, 0, 0,
            0, 1, 0, 0,
            0, 5, 2, 0,
            0, 0, 0, 1
        ]);
        data.asHTML();
    });

    // Third test to display the information of a matrix in html table format
    it("Matrix - asHTML3", function() {
        let data = new Matrix([
            7, 0, 0, 1,
            0, 1, 0, 1,
            2, 0, 1, 1,
            4, 0, 0, 1
        ]);
        data.asHTML();
    });
});
