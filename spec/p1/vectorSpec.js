/**
 * @author Adam Delo
 */

// gets access to Vector so it can be tested
var Vector = require("../../src/shared/matrix-math").Vector;

/**
 * Compares a Vector to some expected data.
 *
 * @param {Vector} vec Vector to check
 * @param {Array} expected Array of values expected from vec
 */
function testVector(vec, expected) {
    // Check to see if the array returned from getData has
    // a length of 4.
    // expect takes a value and the result returned can be
    // compared with toBe (for equals), toBeLessThan,
    // toBeGreaterThan, etc., to the expected value.
    expect(vec.getData().length).toBe(4);

    // Checks to see if the array has the same values as the
    // expected array. Since these are floating-point numbers,
    // the data is compared to see if it is close enough (in
    // this case, the same to 3 decimal places).
    let data = vec.getData();
    for (let i = 0; i < 4; i++) {
        expect(data[i]).toBeCloseTo(expected[i], 3,
            " Actual: " + data + " Expected: " + expected);
    }
}

// describe is a function call that creates a test suite
// You can create as many test suites as you need by
// adding more calls to describe.
// The first parameter is the name of the suite (so pick
// something useful) and the second is a function with
// no parameters.  Doing
//      function () {
//          //code
//      }
// creates a function inline.
// NOTE: describe is a function, so it needs ( )'s
// around the body.
describe("Vector Constructor", function() {

    // it creates a test that will be run within the
    // suite. It is also a function and its first parameter
    // is also a description. The second parameter is a
    // function with the code to run the test.
    it("Vector Constructor - No data", function() {
        // check the default constructor
        testVector(new Vector(), [0, 0, 0, 0]);
    });

    // a second test that checks creating a Vector with
    // exactly 3 values in the array.
    // Note that Vector takes an array and not multiple
    // parameters.
    it("Vector Constructor - 3 values", function() {
        testVector(new Vector([2.5, 3.15, -30]), [2.5, 3.15, -30, 0]);
    });

    // Tests the dot product of a vector with another vector
    it("Vector Constructor - dotProduct", function() {
        let data = new Vector([1, 1, 1]);
        let data2 = new Vector([1, 1, 1]);
        data = data.dotProduct(data2);
        return data;
    });

    // Second test for the dot product of a vector with another vector
    it("Vector Constructor - dotProduct2", function() {
        let data = new Vector([1, 6, 2]);
        let data2 = new Vector([4, 2, 1]);
        data = data.dotProduct(data2);
        return data;
    });

    // Third test for the dot product of a vector with another vector
    it("Vector Constructor - dotProduct3", function() {
        let data = new Vector([8, 3, 1]);
        let data2 = new Vector([1, 4, 12]);
        data = data.dotProduct(data2);
        return data;
    });

    // Test for the cross product of a vector with another vector
    it("Vector Constructor - crossProduct", function() {
        let data = new Vector([1, 1, 1]);
        let data2 = new Vector([1, 1, 1]);
        data = data.crossProduct(data2);
        testVector(data, new Vector([0, 0, 0]).getData());
    });

    // Second test for the cross product of a vector with another vector
    it("Vector Constructor - crossProduct2", function() {
        let data = new Vector([5, 8, 2]);
        let data2 = new Vector([3, 2, 1]);
        data = data.crossProduct(data2);
        testVector(data, new Vector([4, 1, -14]).getData());
    });

    // Third test for the cross product of a vector with another vector
    it("Vector Constructor - crossProduct3", function() {
        let data = new Vector([6, 7, 8]);
        let data2 = new Vector([2, 1, 2]);
        data = data.crossProduct(data2);
        testVector(data, new Vector([6, 4, -8]).getData());
    });

    // Test for adding two vectors together
    it("Vector Constructor - add", function() {
        let data = new Vector([1, 1, 1]);
        let data2 = new Vector([1, 1, 1]);
        data.add(data2);
        return data;
    });

    // Second test for adding two vectors together
    it("Vector Constructor - add2", function() {
        let data = new Vector([5, 4, 2]);
        let data2 = new Vector([1, 2, 3]);
        data.add(data2);
        return data;
    });

    // Third test for adding two vectors together
    it("Vector Constructor - add3", function() {
        let data = new Vector([-1, 2, -3]);
        let data2 = new Vector([1, -2, 5]);
        data.add(data2);
        return data;
    });

    // Test for subtracting one vector from another
    it("Vector Constructor - subtract", function() {
        let data = new Vector([1, 1, 1]);
        let data2 = new Vector([1, 1, 1]);
        data.subtract(data2);
        return data;
    });

    // Second test for subtracting one vector from another
    it("Vector Constructor - subtract2", function() {
        let data = new Vector([4, 4, 2]);
        let data2 = new Vector([1, 2, 3]);
        data.subtract(data2);
        return data;
    });

    // Third test for subtracting one vector from another
    it("Vector Constructor - subtract3", function() {
        let data = new Vector([-3, 1, -4]);
        let data2 = new Vector([-4, -2, 1]);
        data.subtract(data2);
        return data;
    });

    // Test for normalizing the data of a vector
    it("Vector Constructor - normalize", function() {
        let data = new Vector([1, 1, 1]);
        data.normalize();
        return data;
    });

    // Second test for normalizing the data of a vector
    it("Vector Constructor - normalize2", function() {
        let data = new Vector([5, 3, 2]);
        data.normalize();
        return data;
    });

    // Third test for normalizing the data of a vector
    it("Vector Constructor - normalize3", function() {
        let data = new Vector([2, 17, -31]);
        data.normalize();
        return data;
    });

    // Test to return the length of a vector
    it("Vector Constructor - length", function() {
        let data = new Vector([5, 3, 1]);
        return data.length();
    });

    // Second test to return the length of a vector
    it("Vector Constructor - length2", function() {
        let data = new Vector([5, 3, 1, 5, 0, 1, 2]);
        return data.length();
    });

    // Third test to return the length of a vector
    it("Vector Constructor - lengt3", function() {
        let data = new Vector([]);
        return data.length();
    });

    // Test to scale a vector by a scaling amount
    it("Vector Constructor - scale", function() {
        let scale = 5;
        let data = new Vector([1, 1, 1]);
        data.scale(scale);
        return data;
    });

    // Second test to scale a vector by a scaling amount
    it("Vector Constructor - scale2", function() {
        let scale = 2;
        let data = new Vector([12, 4, 1]);
        data.scale(scale);
        return data;
    });

    // Third test to scale a vector by a scaling amount
    it("Vector Constructor - scale3", function() {
        let scale = 20;
        let data = new Vector([1, 1, 2, 5, 6]);
        data.scale(scale);
        return data;
    });

    // Test to get the x value of a vector
    it("Vector Constructor - getX", function() {
        let data = new Vector([1, 1, 1]);
        data.getX();
    });

    // Secnod test to get the x value of a vector
    it("Vector Constructor - getX2", function() {
        let data = new Vector([5, 2, 1]);
        data.getX();
    });

    // Third test to get the x value of a vector
    it("Vector Constructor - getX3", function() {
        let data = new Vector([7, 5, 1]);
        data.getX();
    });

    // Test to get the y value of a vector
    it("Vector Constructor - getY", function() {
        let data = new Vector([1, 1, 1]);
        data.getY();
    });

    // Second test to get the y value of a vector
    it("Vector Constructor - getY2", function() {
        let data = new Vector([4, 3, 1]);
        data.getY();
    });

    // Third test to get the y value of a vector
    it("Vector Constructor - getY3", function() {
        let data = new Vector([7, 6, 1]);
        data.getY();
    });

    // Test to get the z value of a vector
    it("Vector Constructor - getZ", function() {
        let data = new Vector([1, 1, 1]);
        data.getZ();
    });

    // Second test to get the z value of a vector
    it("Vector Constructor - getZ2", function() {
        let data = new Vector([5, 2, 6]);
        data.getZ();
    });

    // Third test to get the z value of a vector
    it("Vector Constructor - getZ3", function() {
        let data = new Vector([7, 5, 9]);
        data.getZ();
    });

    // Test to get and return the data from a vector
    it("Vector Constructor - getData", function() {
        let data = new Vector([1, 1, 1]);
        data.getData();
    });

    // Second test to get and return the data from a vector
    it("Vector Constructor - getData2", function() {
        let data = new Vector([5, 2, 1, 2]);
        data.getData();
    });

    // Third test to get and return the data from a vector
    it("Vector Constructor - getData3", function() {
        let data = new Vector([2, 1, 6]);
        data.getData();
    });
});


