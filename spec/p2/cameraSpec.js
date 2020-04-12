var Vector = require("../../src/shared/matrix-math").Vector;
var Camera = require("../../src/shared/matrix-math").Camera;

/**
 *
 * @param {Array} expected Array of expected data
 * @param {Matrix} act Actual data to comapre to expected data
 * @param {string} msg Message to print with a failed test
 */
function testMatrix(act, expected, msg) {
    act.getData().every((val, i) => {
        expect(val).toBeCloseTo(expected[i], 3,
            msg + " Actual: " + act.getData() + " Expected: " + expected);
        return true;
    });
}

describe("Camera", function() {
    it("Camera - Constructor", function() {
        let c = new Camera();
        testMatrix(c.getProjection(),
            [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1],
            "Calling getProjection after creating a Camera");
        testMatrix(c.getView(),
            [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1],
            "Calling getView after creating a Camera");
    });

    it("Camera - Ortho", function() {
        let left = -20;
        let right = 20;
        let bottom = -20;
        let top = 20;
        let near = 10;
        let far = 50;
        let data = new Camera();
        testMatrix(data.ortho(left, right, bottom, top, near, far),
            [
                0.05, 0, 0, 0,
                0, 0.05, 0, 0,
                0, 0, -0.05, 0,
                0, 0, -1.5, 1
            ]);
    });

    it("Camera - Ortho2", function() {
        let left = -40;
        let right = 40;
        let bottom = -10;
        let top = 10;
        let near = 30;
        let far = 110;
        let data = new Camera();
        testMatrix(data.ortho(left, right, bottom, top, near, far),
            [
                0.025, 0, 0, 0,
                0, 0.1, 0, 0,
                0, 0, -0.025, 0,
                0, 0, -1.75, 1
            ]);
    });

    it("Camera - Ortho3", function() {
        let left = -2;
        let right = 2;
        let bottom = -1;
        let top = 1;
        let near = 3;
        let far = 4;
        let data = new Camera();
        testMatrix(data.ortho(left, right, bottom, top, near, far),
            [
                0.5, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, -2, 0,
                0, 0, -7, 1
            ]);
    });

    it("Camera - Frustum", function() {
        let left = -20;
        let right = 20;
        let bottom = -20;
        let top = 20;
        let near = 10;
        let far = 50;
        let data = new Camera();
        testMatrix(data.frustum(left, right, bottom, top, near, far),
            [
                0.5, 0, 0, 0,
                0, 0.5, 0, 0,
                0, 0, -1, -1,
                0, 0, -25, 0
            ]);
    });

    it("Camera - Frustum2", function() {
        let left = -40;
        let right = 40;
        let bottom = -10;
        let top = 10;
        let near = 30;
        let far = 110;
        let data = new Camera();
        testMatrix(data.frustum(left, right, bottom, top, near, far),
            [
                0.75, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, -1, -1,
                0, 0, -82.5, 0
            ]);
    });

    it("Camera - Frustum3", function() {
        let left = -2;
        let right = 2;
        let bottom = -1;
        let top = 1;
        let near = 3;
        let far = 4;
        let data = new Camera();
        testMatrix(data.frustum(left, right, bottom, top, near, far),
            [
                1.5, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, -1, -1,
                0, 0, -24, 0
            ]);
    });

    it("Camera - LookAt2", function() {
        let eyeLocation = new Vector(0, 0, 0, 0);
        let lookedAt = new Vector(0, 0, 0, 0);
        let upVector = new Vector(0, 0, 0, 0);
        let data = new Camera();
        testMatrix(data.lookAt(eyeLocation, lookedAt, upVector), [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 1
        ]);
    });
});
