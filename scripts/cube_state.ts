import vec3 from "../../Common/tsm/vec3";
import quat from "../../Common/tsm/quat";

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
    orientation: quat; // TODO: use an orientation representation less subject to floating-point errors
    readonly faces: Face[]; // Left, right, bottomm, top, back, front (x, y, z; negative then positive)

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
            rot.multiplyVec3(cubie.position, cubie.position); // 2nd arg is an output parameter
            cubie.position.x = Math.round(cubie.position.x);
            cubie.position.y = Math.round(cubie.position.y);
            cubie.position.z = Math.round(cubie.position.z);
            cubie.orientation = rot.copy().multiply(cubie.orientation);
            // TODO: "round" orientation to 90* angles
            //cubie.orientation.normalize();
        });
    }

    rotate_r(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }
    rotate_r_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);

        return new CubeState(cubies);
    }

    rotate_l(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }
    rotate_l_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);

        return new CubeState(cubies);
    }

    rotate_u(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }
    rotate_u_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);

        return new CubeState(cubies);
    }

    rotate_d(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }
    rotate_d_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.up, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);

        return new CubeState(cubies);
    }

    rotate_f(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }
    rotate_f_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);

        return new CubeState(cubies);
    }

    rotate_b(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }
    rotate_b_ccw(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rot = quat.fromAxisAngle(vec3.forward, -Math.PI/2);
        this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);

        return new CubeState(cubies);
    }

    // TODO: center slices?
}

export {
    Face,
    Cubie,
    CubeState
}