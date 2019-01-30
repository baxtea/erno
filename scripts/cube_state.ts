import vec3 from "./tsm/vec3";
import quat from "./tsm/quat";

enum Face {
    Red = 0,
    Orange,
    Yellow,
    Green,
    Blue,
    White,
}

class Cubie {
    position: vec3;
    orientation: quat;
    readonly faces: Face[]; // Left, right, bottom, top, back, front (x, y, z; negative then positive)

    constructor(offset: vec3, faces: Face[], orientation = quat.identity.copy()) {
        this.position = offset;
        this.orientation = orientation;
        this.faces = faces;
    }

    copy(): Cubie {
        return new Cubie(
            this.position.copy(),
            this.faces.slice(0), // Shallow copy is okay because faces never change
            this.orientation.copy(),
        );
    }
}

/**
 * Immutable class to store one state of a Rubik's Cube
 */
class CubeState {
    readonly cubies: Cubie[];

    constructor(cubies: Cubie[]) {
        this.cubies = cubies;
    };

    copy(): CubeState {
        return new CubeState( this.cubies.map(c => c.copy()) );
    }

    // White on top, green facing the camera
    static default(): CubeState {
        // * remember +1 in z is towards camera
        let cubies = [
            // Left slice (row-major order)
            new Cubie(new vec3([-1, -1, -1]), [Face.Orange, null, Face.Yellow, null, Face.Blue, null]),
            new Cubie(new vec3([-1, -1,  0]), [Face.Orange, null, Face.Yellow, null, null, null]),
            new Cubie(new vec3([-1, -1,  1]), [Face.Orange, null, Face.Yellow, null, null, Face.Green]),
            new Cubie(new vec3([-1,  0, -1]), [Face.Orange, null, null, null, Face.Blue, null]),
            new Cubie(new vec3([-1,  0,  0]), [Face.Orange, null, null, null, null, null]),
            new Cubie(new vec3([-1,  0,  1]), [Face.Orange, null, null, null, null, Face.Green]),
            new Cubie(new vec3([-1,  1, -1]), [Face.Orange, null, null, Face.White, Face.Blue, null]),
            new Cubie(new vec3([-1,  1,  0]), [Face.Orange, null, null, Face.White, null, null]),
            new Cubie(new vec3([-1,  1,  1]), [Face.Orange, null, null, Face.White, null, Face.Green]),

            // Mid slice (row-major order)
            new Cubie(new vec3([ 0, -1, -1]), [null, null, Face.Yellow, null, Face.Blue, null]),
            new Cubie(new vec3([ 0, -1,  0]), [null, null, Face.Yellow, null, null, null]),
            new Cubie(new vec3([ 0, -1,  1]), [null, null, Face.Yellow, null, null, Face.Green]),
            new Cubie(new vec3([ 0,  0, -1]), [null, null, null, null, Face.Blue, null]),
            // new Cubie(new vec3([ 0,  0,  0]), [null, null, null, null, null, null]),
            new Cubie(new vec3([ 0,  0,  1]), [null, null, null, null, null, Face.Green]),
            new Cubie(new vec3([ 0,  1, -1]), [null, null, null, Face.White, Face.Blue, null]),
            new Cubie(new vec3([ 0,  1,  0]), [null, null, null, Face.White, null, null]),
            new Cubie(new vec3([ 0,  1,  1]), [null, null, null, Face.White, null, Face.Green]),

            // Right slice (row-major order)
            new Cubie(new vec3([ 1, -1, -1]), [null, Face.Red, Face.Yellow, null, Face.Blue, null]),
            new Cubie(new vec3([ 1, -1,  0]), [null, Face.Red, Face.Yellow, null, null, null]),
            new Cubie(new vec3([ 1, -1,  1]), [null, Face.Red, Face.Yellow, null, null, Face.Green]),
            new Cubie(new vec3([ 1,  0, -1]), [null, Face.Red, null, null, Face.Blue, null]),
            new Cubie(new vec3([ 1,  0,  0]), [null, Face.Red, null, null, null, null]),
            new Cubie(new vec3([ 1,  0,  1]), [null, Face.Red, null, null, null, Face.Green]),
            new Cubie(new vec3([ 1,  1, -1]), [null, Face.Red, null, Face.White, Face.Blue, null]),
            new Cubie(new vec3([ 1,  1,  0]), [null, Face.Red, null, Face.White, null, null]),
            new Cubie(new vec3([ 1,  1,  1]), [null, Face.Red, null, Face.White, null, Face.Green]),
        ];

        return new CubeState(cubies);
    }

    private apply_rotation(cubies: Cubie[], rot: quat): void {
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
    rotate_r(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }
    rotate_r_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }
    rotate_r2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }

    /// M (middle layer) turns are a turn of the slice in between slices L and R, in the direction of an L turn
    rotate_m(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }
    rotate_m_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }
    rotate_m2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }

    /// L turns rotate the left slice
    rotate_l(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }
    rotate_l_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }
    rotate_l2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }

    /// U turns rotate the top slice
    rotate_u(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }
    rotate_u_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }
    rotate_u2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }

    /// E (equitorial layer) turns are a turn of the slice in between slices U and D, in the direction of a D turn
    rotate_e(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }
    rotate_e_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }
    rotate_e2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }

    /// D turns rotate the bottom slice
    rotate_d(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }
    rotate_d_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }
    rotate_d2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }

    /// F turns rotate the front slice
    rotate_f(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }
    rotate_f_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }
    rotate_f2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }

    // S (standing layer) turn sare a turn of the slice in between slices F and B, in the direction of an F turn
    rotate_s(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }
    rotate_s_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }
    rotate_s2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }

    /// B turns rotate the back slice
    rotate_b(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }
    rotate_b_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }
    rotate_b2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }

    /// Reorients the entire cube with a rotation around the x-axis
    rotate_x(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_x_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_x2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }

    ///Reorients the entire cube with a rotation around the y-axis
    rotate_y(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_y_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_y2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }

    /// Reorients the entire cube with a rotation around the z-axis
    rotate_z(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_z_ccw(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_z2(): CubeState {
        var cubies = this.cubies.map(c => c.copy()); // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }

    /// Rotate both right slices simultaneously
    rotate_rw(): CubeState {
        return this.rotate_r().rotate_m_ccw();
    }
    rotate_rw_ccw(): CubeState {
        return this.rotate_r_ccw().rotate_m();
    }
    rotate_rw2(): CubeState {
        return this.rotate_r2().rotate_m2();
    }
    /// Rotate both left slices simultaneously
    rotate_lw(): CubeState {
        return this.rotate_l().rotate_m();
    }
    rotate_lw_ccw(): CubeState {
        return this.rotate_l_ccw().rotate_m_ccw();
    }
    rotate_lw2(): CubeState {
        return this.rotate_l2().rotate_m2();
    }

    /// Rotate both top slices simultaneously
    rotate_uw(): CubeState {
        return this.rotate_u().rotate_e_ccw();
    }
    rotate_uw_ccw(): CubeState {
        return this.rotate_u_ccw().rotate_e();
    }
    rotate_uw2(): CubeState {
        return this.rotate_u2().rotate_e2();
    }
    /// Rotate both bottom slices simultaneously
    rotate_dw(): CubeState {
        return this.rotate_d().rotate_e();
    }
    rotate_dw_ccw(): CubeState {
        return this.rotate_d_ccw().rotate_e_ccw();
    }
    rotate_dw2(): CubeState {
        return this.rotate_d2().rotate_e2();
    }

    /// Rotate both front slices simultaneously
    rotate_fw(): CubeState {
        return this.rotate_f().rotate_s();
    }
    rotate_fw_ccw(): CubeState {
        return this.rotate_f_ccw().rotate_s_ccw();
    }
    rotate_fw2(): CubeState {
        return this.rotate_f2().rotate_s2();
    }
    /// Rotate both back slices simultaneously
    rotate_bw(): CubeState {
        return this.rotate_b().rotate_s_ccw();
    }
    rotate_bw_ccw(): CubeState {
        return this.rotate_b_ccw().rotate_s();
    }
    rotate_bw2(): CubeState {
        return this.rotate_b2().rotate_s2();
    }
}

export {
    Face,
    Cubie,
    CubeState
}