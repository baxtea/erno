define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CubeSolver {
        constructor(initial_state) {
            this.state = initial_state;
        }
        step() {
            alert("Solver not implemented!");
        }
    }
    exports.CubeSolver = CubeSolver;
});
