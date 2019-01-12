define(["require", "exports", "./tsm/vec3", "./tsm/quat"], function (require, exports, vec3_1, quat_1) {
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
        copy() {
            return new Cubie(this.position.copy(), this.faces.slice(0), // Shallow copy is okay because
            this.orientation.copy());
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
        copy() {
            return new CubeState(this.cubies.map(c => c.copy()));
        }
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
        apply_rotation(cubies, rot) {
            cubies.map(cubie => {
                // Apply the rotation to the cubie's position
                rot.multiplyVec3(cubie.position, cubie.position); // 2nd arg is an output parameter
                // Snap to unit grid
                cubie.position.x = Math.round(cubie.position.x);
                cubie.position.y = Math.round(cubie.position.y);
                cubie.position.z = Math.round(cubie.position.z);
                // Apply the rotation to the cubie's orientation
                cubie.orientation = rot.copy().multiply(cubie.orientation);
            });
        }
        /// R turns rotate the right slice
        rotate_r() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        rotate_r_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        rotate_r2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        /// M (middle layer) turns are a turn of the slice in between slices L and R, in the direction of an L turn
        rotate_m() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        rotate_m_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        rotate_m2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        /// L turns rotate the left slice
        rotate_l() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        rotate_l_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        rotate_l2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        /// U turns rotate the top slice
        rotate_u() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        rotate_u_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        rotate_u2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        /// E (equitorial layer) turns are a turn of the slice in between slices U and D, in the direction of a D turn
        rotate_e() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        rotate_e_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        rotate_e2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        /// D turns rotate the bottom slice
        rotate_d() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        rotate_d_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        rotate_d2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        /// F turns rotate the front slice
        rotate_f() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        rotate_f_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        rotate_f2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        // S (standing layer) turn sare a turn of the slice in between slices F and B, in the direction of an F turn
        rotate_s() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        rotate_s_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        rotate_s2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        /// B turns rotate the back slice
        rotate_b() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        rotate_b_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        rotate_b2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        /// Reorients the entire cube with a rotation around the x-axis
        rotate_x() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_x_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_x2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        ///Reorients the entire cube with a rotation around the y-axis
        rotate_y() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_y_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_y2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        /// Reorients the entire cube with a rotation around the z-axis
        rotate_z() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_z_ccw() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_z2() {
            var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        /// Rotate both right slices simultaneously
        rotate_rw() {
            return this.rotate_r().rotate_m_ccw();
        }
        rotate_rw_ccw() {
            return this.rotate_r_ccw().rotate_m();
        }
        rotate_rw2() {
            return this.rotate_r2().rotate_m2();
        }
        /// Rotate both left slices simultaneously
        rotate_lw() {
            return this.rotate_l().rotate_m();
        }
        rotate_lw_ccw() {
            return this.rotate_l_ccw().rotate_m_ccw();
        }
        rotate_lw2() {
            return this.rotate_l2().rotate_m2();
        }
        /// Rotate both top slices simultaneously
        rotate_uw() {
            return this.rotate_u().rotate_e_ccw();
        }
        rotate_uw_ccw() {
            return this.rotate_u_ccw().rotate_e();
        }
        rotate_uw2() {
            return this.rotate_u2().rotate_e2();
        }
        /// Rotate both bottom slices simultaneously
        rotate_dw() {
            return this.rotate_d().rotate_e();
        }
        rotate_dw_ccw() {
            return this.rotate_d_ccw().rotate_e_ccw();
        }
        rotate_dw2() {
            return this.rotate_d2().rotate_e2();
        }
        /// Rotate both front slices simultaneously
        rotate_fw() {
            return this.rotate_f().rotate_s();
        }
        rotate_fw_ccw() {
            return this.rotate_f_ccw().rotate_s_ccw();
        }
        rotate_fw2() {
            return this.rotate_f2().rotate_s2();
        }
        /// Rotate both back slices simultaneously
        rotate_bw() {
            return this.rotate_b().rotate_s_ccw();
        }
        rotate_bw_ccw() {
            return this.rotate_b_ccw().rotate_s();
        }
        rotate_bw2() {
            return this.rotate_b2().rotate_s2();
        }
    }
    exports.CubeState = CubeState;
});
