import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";
import fscreen from "./fscreen";
import { CubeSolver } from "./cube_solver";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let init_canvas_w: number = canvas.width;
let init_canvas_h: number = canvas.height;
let renderer = new CubeRenderer(canvas);

// Bind F to full-screen toggle
canvas.tabIndex = 0; // Force the canvas to respond to keyboard events
canvas.style.outline = "none";
canvas.addEventListener("keydown", function(e) {
    if (e.key == " ") {
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
var anim_time = 0.0; // Seconds it takes for one slice action (usually a 90* rotation)

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


let reset_button = <HTMLButtonElement> document.getElementById("reset");
reset_button.addEventListener("click", function(_e) {
    current_state = CubeState.default();
    // animator.reset();
});

let scramble_button = <HTMLButtonElement> document.getElementById("scramble");
scramble_button.addEventListener("click", function(_e) {
    // ? Not sure if I want to animate this or not
    // If so, would have to be at a very high speed so it couldn't be
    let moves = [
        CubeState.prototype.rotate_r,
        CubeState.prototype.rotate_r_ccw,
        CubeState.prototype.rotate_r2,
        CubeState.prototype.rotate_m,
        CubeState.prototype.rotate_m_ccw,
        CubeState.prototype.rotate_m2,
        CubeState.prototype.rotate_l,
        CubeState.prototype.rotate_l_ccw,
        CubeState.prototype.rotate_l2,

        CubeState.prototype.rotate_u,
        CubeState.prototype.rotate_u_ccw,
        CubeState.prototype.rotate_u2,
        CubeState.prototype.rotate_e,
        CubeState.prototype.rotate_e_ccw,
        CubeState.prototype.rotate_e2,
        CubeState.prototype.rotate_d,
        CubeState.prototype.rotate_d_ccw,
        CubeState.prototype.rotate_d2,

        CubeState.prototype.rotate_f,
        CubeState.prototype.rotate_f_ccw,
        CubeState.prototype.rotate_f2,
        CubeState.prototype.rotate_s,
        CubeState.prototype.rotate_s_ccw,
        CubeState.prototype.rotate_s2,
        CubeState.prototype.rotate_b,
        CubeState.prototype.rotate_b_ccw,
        CubeState.prototype.rotate_b2,
    ];

    let num_moves = Math.floor(Math.random() * 10) + 30; // Random number of moves between 30 and 40
    for (let i = 0; i < num_moves; ++i) {
        let chosen_move = moves[Math.floor(Math.random()*moves.length)];
        current_state = chosen_move.call(current_state);
        // animator.push_rotation(chosen_move);
    }
});

let solve_button = <HTMLButtonElement> document.getElementById("solve");
solve_button.addEventListener("click", function(_e) {
    let solver = new CubeSolver(current_state);
    while (!solver.solved()) {
        solver.step();
    }
});

let anim_time_slider = <HTMLInputElement> document.getElementById("anim-time");
anim_time_slider.addEventListener("change", function(_e) {
    anim_time = anim_time_slider.valueAsNumber;
    console.log(`New animation time: ${anim_time}`);
});

let algorithm_text = <HTMLInputElement> document.getElementById("algo-text");
function run_text_algorithm(): void {
    let moves = new Map([
        ["R",   CubeState.prototype.rotate_r],
        ["R\'", CubeState.prototype.rotate_r_ccw],
        ["R2",  CubeState.prototype.rotate_r2],
        ["M",   CubeState.prototype.rotate_m],
        ["M\'", CubeState.prototype.rotate_m_ccw],
        ["M2",  CubeState.prototype.rotate_m2],
        ["L",   CubeState.prototype.rotate_l],
        ["L\'", CubeState.prototype.rotate_l_ccw],
        ["L2",  CubeState.prototype.rotate_l2],

        ["U",   CubeState.prototype.rotate_u],
        ["U\'", CubeState.prototype.rotate_u_ccw],
        ["U2",  CubeState.prototype.rotate_u2],
        ["E",   CubeState.prototype.rotate_e],
        ["E\'", CubeState.prototype.rotate_e_ccw],
        ["E2",  CubeState.prototype.rotate_e2],
        ["D",   CubeState.prototype.rotate_d],
        ["D\'", CubeState.prototype.rotate_d_ccw],
        ["D2",  CubeState.prototype.rotate_d2],

        ["F",   CubeState.prototype.rotate_f],
        ["F\'", CubeState.prototype.rotate_f_ccw],
        ["F2",  CubeState.prototype.rotate_f2],
        ["S",   CubeState.prototype.rotate_s],
        ["S\'", CubeState.prototype.rotate_s_ccw],
        ["S2",  CubeState.prototype.rotate_s2],
        ["B",   CubeState.prototype.rotate_b],
        ["B\'", CubeState.prototype.rotate_b_ccw],
        ["B2",  CubeState.prototype.rotate_b2],

        ["X",   CubeState.prototype.rotate_x],
        ["X\'", CubeState.prototype.rotate_x_ccw],
        ["X2",  CubeState.prototype.rotate_x2],
        ["Y",   CubeState.prototype.rotate_y],
        ["Y\'", CubeState.prototype.rotate_y_ccw],
        ["Y2",  CubeState.prototype.rotate_y2],
        ["Z",   CubeState.prototype.rotate_z],
        ["Z\'", CubeState.prototype.rotate_z_ccw],
        ["Z2",  CubeState.prototype.rotate_z2],
    ]);

    var sandbox = current_state;
    var errors = false;
    algorithm_text.value.split(" ")
        .filter(v => v != "") // Ignore duplicate, leading, and trailing spaces
        .forEach(move_name => {
            let move_func = moves.get(move_name.toUpperCase());
            if (move_func === undefined) {
                alert(`Unrecognized move ${move_name}`);
                errors = true;
            }
            sandbox = move_func.call(sandbox);
        });

    if (!errors)
        current_state = sandbox;
}
algorithm_text.addEventListener("keydown", e => { if (e.key.toLowerCase() == "enter") run_text_algorithm(); });
canvas.addEventListener("keydown", e => { if (e.key.toLowerCase() == "enter") run_text_algorithm(); });
