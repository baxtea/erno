import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";
import fscreen from "./fscreen";
import { CubeSolver } from "./cube_solver";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let init_canvas_w: number = canvas.width;
let init_canvas_h: number = canvas.height;
let renderer = new CubeRenderer(canvas);

// Bind F to full-screen toggle
canvas.tabIndex = 1000; // Force the canvas to respond to keyboard events
canvas.style.outline = "none";
canvas.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() == "enter") {
        if (fscreen.fullscreenElement == null)
            fscreen.requestFullscreen(canvas);
        else
            fscreen.exitFullscreen();
    }
    else if (e.key == "\`") {
        console.log(current_state);
    }
    // Face rotations
    else if (e.key == "r") {
        current_state = current_state.rotate_r();
    } else if (e.key == "R") {
        current_state = current_state.rotate_r_ccw();
    }
    else if (e.key == "l") {
        current_state = current_state.rotate_l();
    } else if (e.key == "L") {
        current_state = current_state.rotate_l_ccw();
    }
    else if (e.key == "u") {
        current_state = current_state.rotate_u();
    } else if (e.key == "U") {
        current_state = current_state.rotate_u_ccw();
    }
    else if (e.key == "d") {
        current_state = current_state.rotate_d();
    } else if (e.key == "D") {
        current_state = current_state.rotate_d_ccw();
    }
    else if (e.key == "f") {
        current_state = current_state.rotate_f();
    } else if (e.key == "F") {
        current_state = current_state.rotate_f_ccw();
    }
    else if (e.key == "b") {
        current_state = current_state.rotate_b();
    } else if (e.key == "B") {
        current_state = current_state.rotate_b_ccw();
    }
    // Middle slice rotations
    else if (e.key == "m") {
        current_state = current_state.rotate_m();
    } else if (e.key == "M") {
        current_state = current_state.rotate_m_ccw();
    }
    else if (e.key == "e") {
        current_state = current_state.rotate_e();
    } else if (e.key == "E") {
        current_state = current_state.rotate_e_ccw();
    }
    else if (e.key == "s") {
        current_state = current_state.rotate_s();
    } else if (e.key == "S") {
        current_state = current_state.rotate_s_ccw();
    }
    // Whole-cube reorientations
    else if (e.key == "x") {
        current_state = current_state.rotate_x();
    } else if (e.key == "X") {
        current_state = current_state.rotate_x_ccw();
    }
    else if (e.key == "y") {
        current_state = current_state.rotate_y();
    } else if (e.key == "Y") {
        current_state = current_state.rotate_y_ccw();
    }
    else if (e.key == "z") {
        current_state = current_state.rotate_z();
    } else if (e.key == "Z") {
        current_state = current_state.rotate_z_ccw();
    }
});
fscreen.addEventListener("fullscreenchange", function() {
    if (fscreen.fullscreenElement == null) {
        canvas.width = init_canvas_w;
        canvas.height = init_canvas_h;
    }
    else {
        canvas.width = screen.width;
        canvas.height = screen.height;
    }
    renderer.change_viewport(canvas);
});

// Animation details
var current_state = CubeState.default();
// var anim_time = 0.5; // Seconds it takes for one slice action (usually a 90* rotation)

// Timekeeping
let startTime = Date.now();
var lastTime = startTime;

function update() {
    // Timekeeping
    let currentTime = Date.now();
    let elapsed = (currentTime - lastTime)/1000.0; // Translate units from ms to seconds
    lastTime = currentTime;

    // renderer.draw_state(animator.get_interpolated_state(elapsed));
    renderer.draw_state(current_state)

    // Recurse
    requestAnimationFrame(update);
}
update();


let reset = <HTMLButtonElement> document.getElementById("reset");
reset.addEventListener("click", function(_e) {
    current_state = CubeState.default();
});

let scramble = <HTMLButtonElement> document.getElementById("scramble");
scramble.addEventListener("click", function(_e) {
    alert("Scramble not implemented yet");
});

let solve = <HTMLButtonElement> document.getElementById("solve");
solve.addEventListener("click", function(_e) {
    let solver = new CubeSolver(current_state);
    while (!solver.solved()) {
        solver.step();
    }
});