define(["require", "exports", "../../Common/tsm/vec3", "../../Common/tsm/quat"], function (require, exports, vec3_1, quat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Face;
    (function (Face) {
        Face[Face["Red"] = 0] = "Red";
        Face[Face["Orange"] = 1] = "Orange";
        Face[Face["Yellow"] = 2] = "Yellow";
        Face[Face["Green"] = 3] = "Green";
        Face[Face["Blue"] = 4] = "Blue";
        Face[Face["White"] = 5] = "White";
    })(Face || (Face = {}));
    exports.Face = Face;
    class Cubie {
        constructor(offset, faces, orientation = quat_1.default.identity.copy()) {
            this.position = offset;
            this.orientation = orientation;
            this.faces = faces;
        }
    }
    exports.Cubie = Cubie;
    /**
     * Immutable class to store one state of a Rubik's Cube
     */
    class CubeState {
        constructor(cubies) {
            this.cubies = cubies;
        }
        ;
        // White on top, green facing the camera
        static default() {
            // * remember +1 in z is towards camera
            let cubies = [
                // Left slice (row-major order)
                new Cubie(new vec3_1.default([-1, -1, -1]), [Face.Orange, null, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, -1, 0]), [Face.Orange, null, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([-1, -1, 1]), [Face.Orange, null, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([-1, 0, -1]), [Face.Orange, null, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, 0, 0]), [Face.Orange, null, null, null, null, null]),
                new Cubie(new vec3_1.default([-1, 0, 1]), [Face.Orange, null, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([-1, 1, -1]), [Face.Orange, null, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, 1, 0]), [Face.Orange, null, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([-1, 1, 1]), [Face.Orange, null, null, Face.White, null, Face.Green]),
                // Mid slice (row-major order)
                new Cubie(new vec3_1.default([0, -1, -1]), [null, null, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, -1, 0]), [null, null, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([0, -1, 1]), [null, null, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([0, 0, -1]), [null, null, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, 0, 0]), [null, null, null, null, null, null]),
                new Cubie(new vec3_1.default([0, 0, 1]), [null, null, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([0, 1, -1]), [null, null, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, 1, 0]), [null, null, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([0, 1, 1]), [null, null, null, Face.White, null, Face.Green]),
                // Right slice (row-major order)
                new Cubie(new vec3_1.default([1, -1, -1]), [null, Face.Red, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, -1, 0]), [null, Face.Red, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([1, -1, 1]), [null, Face.Red, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([1, 0, -1]), [null, Face.Red, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, 0, 0]), [null, Face.Red, null, null, null, null]),
                new Cubie(new vec3_1.default([1, 0, 1]), [null, Face.Red, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([1, 1, -1]), [null, Face.Red, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, 1, 0]), [null, Face.Red, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([1, 1, 1]), [null, Face.Red, null, Face.White, null, Face.Green]),
            ];
            return new CubeState(cubies);
        }
        rotate_r() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rotation = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            cubies.slice(18, 27).map(cubie => {
                rotation.multiplyVec3(cubie.position, cubie.position); // 2nd arg is an output parameter
                //cubie.orientation = rotation.copy().multiply(cubie.orientation);
                cubie.orientation.multiply(rotation);
            });
            return new CubeState(cubies);
        }
    }
    exports.CubeState = CubeState;
});
