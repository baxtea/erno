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
}

/**
 * Immutable class to store one state of a Rubik's Cube
 */
class CubeState {
    readonly cubies: Cubie[];

    constructor(cubies: Cubie[]) {
        this.cubies = cubies;
    };

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
            new Cubie(new vec3([ 0,  0,  0]), [null, null, null, null, null, null]),
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
            // TODO: Snap to 90* rotations around world-space axes
            // let angle = Math.acos(cubie.orientation.w) * 2;
            // let sin = Math.sin(angle);
            // let axis = new vec3(cubie.orientation.xyz).scale(1/sin).normalize();
            // console.log(axis.x, axis.y, axis.z, angle/Math.PI);

            // let angle_over_pi = angle/Math.PI
            // var angle_snap = null;
            // if (Math.abs(angle_over_pi)/3 < Math.abs(angle_over_pi)/4) { // Angle is in thirds
            //     angle_snap = (Math.round(angle_over_pi * 3) % 6) / 3 * Math.PI;
            // } else { // Angle is in quarters
            //     angle_snap = (Math.round(angle_over_pi * 4) % 8) / 4 * Math.PI;
            // }
            // console.log(angle_snap / Math.PI);

            // quat.fromAxisAngle(axis, angle_snap, cubie.orientation);
            // if (angle_snap >= Math.PI) cubie.orientation.conjugate();
            // //if (angle_snap >= Math.PI) cubie.orientation.conjugate(); // 3rd arg is output

            // // let axis_possibilities = [-1, -Math.sqrt(3)/3, 0, Math.sqrt(3)/3, 1];
            // // let axis_snap = new vec3(<[number, number, number]> axis.xyz.map(v => {
            // //     var min_dist = Number.POSITIVE_INFINITY;
            // //     var min_dist_i = 0;
            // //     for (let i = 1; i < axis_possibilities.length; ++i) {
            // //         let dist = Math.abs(axis_possibilities[i] - v);
            // //         if (dist < min_dist)
            // //             min_dist_i = i;
            // //     }
            // //     return axis_possibilities[min_dist_i];
            // // })).normalize();

            // // cubie.orientation = quat.fromAxisAngle(axis, angle);
            // // console.log(axis_snap.x, axis_snap.y, axis_snap.z, angle/Math.PI);
        });
    }

    /// R turns rotate the right slice
    rotate_r(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }
    rotate_r_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }
    rotate_r2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }

    /// M (middle layer) turns are a turn of the slice in between slices L and R, in the direction of an L turn
    rotate_m(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }
    rotate_m_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }
    rotate_m2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);

        return new CubeState(cubies);
    }

    /// L turns rotate the left slice
    rotate_l(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }
    rotate_l_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }
    rotate_l2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }

    /// U turns rotate the top slice
    rotate_u(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }
    rotate_u_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }
    rotate_u2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }

    /// E (equitorial layer) turns are a turn of the slice in between slices U and D, in the direction of a D turn
    rotate_e(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }
    rotate_e_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }
    rotate_e2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);

        return new CubeState(cubies);
    }

    /// D turns rotate the bottom slice
    rotate_d(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }
    rotate_d_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }
    rotate_d2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }

    /// F turns rotate the front slice
    rotate_f(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }
    rotate_f_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }
    rotate_f2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }

    // S (standing layer) turn sare a turn of the slice in between slices F and B, in the direction of an F turn
    rotate_s(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }
    rotate_s_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }
    rotate_s2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);

        return new CubeState(cubies);
    }

    /// B turns rotate the back slice
    rotate_b(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }
    rotate_b_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }
    rotate_b2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }

    /// Reorients the entire cube with a rotation around the x-axis
    rotate_x(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_x_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_x2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, t * Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }

    ///Reorients the entire cube with a rotation around the y-axis
    rotate_y(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_y_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_y2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, t * Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }

    /// Reorients the entire cube with a rotation around the z-axis
    rotate_z(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * -Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_z_ccw(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI/2);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
    rotate_z2(t: number = 1.0): CubeState {
        var cubies = this.cubies.map(x => Object.assign({}, x));; // Creates a deep copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, t * Math.PI);
        this.apply_rotation(cubies, rot);

        return new CubeState(cubies);
    }
}

export {
    Face,
    Cubie,
    CubeState
}