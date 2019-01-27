import { CubeState } from "./cube_state";
import { CubeAnimator } from "./cube_animator";

class CubeSolver {
    state: CubeState;

    constructor(_initial_state: CubeAnimator) {
        // this.state = initial_state;
    }

    solved(): boolean {
        alert("Solver not implemented!");
        return false;
    }

    step() {
        alert("Solver not implemented!");
    }
}

export {
    CubeSolver
}