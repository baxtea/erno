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

    rotate_r(): CubeState {
        var cubies = this.cubies.slice(0); // Creates a copy of this.cubies

        let rotation = quat.fromAxisAngle(vec3.right, -Math.PI/2);
        cubies.slice(18, 27).map(cubie => {
            rotation.multiplyVec3(cubie.position, cubie.position); // 2nd arg is an output parameter
            //cubie.orientation = rotation.copy().multiply(cubie.orientation);
            cubie.orientation.multiply(rotation);
        })

        return new CubeState(cubies);
    }
    // TODO: rotate_r, rotate_r_prime, ...
}

export {
    Face,
    Cubie,
    CubeState
}