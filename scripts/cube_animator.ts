import { CubeState, Cubie } from "./cube_state";
import quat from "./tsm/quat";
import vec3 from "./tsm/vec3";

class CubeAnimator {
    private states: CubeState[];
    private time: number = 0.0;
    // TODO: a setter for animation_duration that adjusts time to preserve the current angle of the pending rotation
    animation_duration: number;

    constructor(animation_duration = 0) {
        this.reset();
        this.animation_duration = animation_duration;
    }

    reset() {
        this.set_state(CubeState.default());
    }

    set_state(state: CubeState): void {
        this.states = [state];
        this.time = 0.0;
    }

    log_state(): void {
        console.log(this.states[0]);
    }

    static interpolate(s0: CubeState, s1: CubeState, t: number): CubeState {
        function zip<T, U>(a0: Array<T>, a1: Array<U>) {
            var arr: Array<[T, U]> = [];
            for (let i = 0; i < a0.length && i < a1.length; ++i) {
                arr.push([a0[i], a1[i]]);
            }
            return arr;
        }

        let cubies = zip(s0.cubies, s1.cubies)
            .map(pair => {
                let c0 = pair[0];
                let c1 = pair[1];

                // TODO: do radial interpolation instead of linear
                // * Maybe that's not smart actually. Smallest distance between two orientations is probably not along a world-space axis
                let interp_orientation = quat.mix(c0.orientation, c1.orientation, t);
                let interp_offset = vec3.mix(c0.position, c1.position, t); // Can probably use orientation to make this better

                return new Cubie(interp_offset, c0.faces, interp_orientation);
            });

        return new CubeState(cubies);
    }

    get_current_state(): CubeState {
        return this.states[this.states.length-1]; // TODO: this leaks data
    }

    end_animation(): void {
        this.set_state(this.states[this.states.length-1]);
    }

    get_interpolated_state(elapsed: number): CubeState {
        this.time += elapsed;
        if (this.animation_duration == 0) {
            // Immediately advance to the last state
            this.states = [ this.states[this.states.length-1] ];
        } else {
            let advances = Math.floor(this.time / this.animation_duration);
            this.time %= elapsed;
            for (let i = 0; i < advances && this.states.length > 1; ++i) {
                this.states.shift();
            }
        }

        if (this.states.length == 1) {
            return this.states[0];
        } else {
            // division by animation_duration will never divide by zero because at this point, this.states would only have one element
            return CubeAnimator.interpolate(this.states[0], this.states[1], this.time / this.animation_duration);
        }
    }

    push_rotation(func: () => CubeState): void {
        this.states.push(func.call(this.states[this.states.length-1]));
    }
}

export {
    CubeAnimator,
}