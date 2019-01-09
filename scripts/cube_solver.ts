import { CubeState } from "./cube_state";

class CubeSolver {
    state: CubeState;

    constructor(initial_state: CubeState) {
        this.state = initial_state;
    }

    step() {
        alert("Solver not implemented!");
    }
}

export {
    CubeSolver
}