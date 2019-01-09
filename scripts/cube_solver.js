define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CubeSolver = /** @class */ (function () {
        function CubeSolver(initial_state) {
            this.state = initial_state;
        }
        CubeSolver.prototype.step = function () {
            alert("Solver not implemented!");
        };
        return CubeSolver;
    }());
    exports.CubeSolver = CubeSolver;
});
