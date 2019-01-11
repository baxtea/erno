define(["require", "exports", "./cube_state", "./tsm/quat"], function (require, exports, cube_state_1, quat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // TODO: undo functionality?
    class CubeAnimator {
        constructor(animation_duration = 0) {
            this.time = 0.0;
            this.reset();
            this.animation_duration = animation_duration;
        }
        reset() {
            this.set_state(cube_state_1.CubeState.default());
        }
        set_state(state) {
            this.states = [state];
            this.time = 0.0;
        }
        static interpolate(s0, s1, t) {
            function zip(a0, a1) {
                var arr = [];
                for (let i = 0; i < a0.length && i < a1.length; ++i) {
                    arr.push([a0[i], a1[i]]);
                }
                return arr;
            }
            let cubies = zip(s0.cubies, s1.cubies)
                .map(pair => {
                let c0 = pair[0];
                let c1 = pair[1];
                let interp_orientation = quat_1.default.mix(c0.orientation, c1.orientation, t);
                let angle = Math.acos(interp_orientation.w) * 2;
                var interp_offset = c0.position;
                if (angle > 0) { // nonstatic; need to interpolate
                    // diff = q2 * inverse(q1)
                    let diff = interp_orientation.copy().multiply(c0.orientation.copy().conjugate());
                    interp_offset = diff.multiplyVec3(c0.position);
                }
                return new cube_state_1.Cubie(interp_offset, c0.faces, interp_orientation);
            });
            return new cube_state_1.CubeState(cubies);
        }
        get_current_state() {
            return this.states[this.states.length - 1].copy();
        }
        end_animation() {
            this.set_state(this.states[this.states.length - 1]);
        }
        get_interpolated_state(elapsed) {
            if (this.states.length > 1)
                this.time += elapsed;
            else
                this.time = 0;
            if (this.animation_duration == 0) {
                // Immediately advance to the last state
                this.states = [this.states[this.states.length - 1]];
            }
            else {
                let advances = Math.floor(this.time / this.animation_duration);
                this.time %= this.animation_duration;
                for (let i = 0; i < advances && this.states.length > 1; ++i) {
                    this.states.shift();
                }
            }
            if (this.states.length == 1) {
                return this.states[0];
            }
            else {
                // division by animation_duration will never divide by zero because at this point, this.states would only have one element
                return CubeAnimator.interpolate(this.states[0], this.states[1], this.time / this.animation_duration);
            }
        }
        push_rotation(func) {
            this.states.push(func.call(this.states[this.states.length - 1]));
        }
    }
    exports.CubeAnimator = CubeAnimator;
});
