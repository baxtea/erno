import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";
import fscreen from "./fscreen";
import { CubeSolver } from "./cube_solver";
import { CubeAnimator } from "./cube_animator";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let init_canvas_w: number = canvas.width;
let init_canvas_h: number = canvas.height;
let renderer = new CubeRenderer(canvas);
let animator = new CubeAnimator(0.2);

let canvas_div = <HTMLDivElement> document.getElementsByClassName("canvas-container")[0];
let text_canvas = <HTMLCanvasElement> document.getElementById("text-canvas");
let ctx2d = text_canvas.getContext("2d");
var show_help = true;

// Bind F to full-screen toggle
text_canvas.tabIndex = 1000; // Force the canvas to respond to keyboard events
text_canvas.focus();
text_canvas.style.outline = "none";
text_canvas.addEventListener("keydown", function(e) {
    if (e.key == " ") {
        if (fscreen.fullscreenElement == null)
            fscreen.requestFullscreen(canvas_div);
        else
            fscreen.exitFullscreen();
    }
    else if (e.key.toLowerCase() == "h") {
        show_help = !show_help;
    }
    // Face rotations
    else if (e.key == "r") {
        animator.push_rotation(CubeState.prototype.rotate_r);
    } else if (e.key == "R") {
        animator.push_rotation(CubeState.prototype.rotate_r_ccw);
    }
    else if (e.key == "l") {
        animator.push_rotation(CubeState.prototype.rotate_l);
    } else if (e.key == "L") {
        animator.push_rotation(CubeState.prototype.rotate_l_ccw);
    }
    else if (e.key == "u") {
        animator.push_rotation(CubeState.prototype.rotate_u);
    } else if (e.key == "U") {
        animator.push_rotation(CubeState.prototype.rotate_u_ccw);
    }
    else if (e.key == "d") {
        animator.push_rotation(CubeState.prototype.rotate_d);
    } else if (e.key == "D") {
        animator.push_rotation(CubeState.prototype.rotate_d_ccw);
    }
    else if (e.key == "f") {
        animator.push_rotation(CubeState.prototype.rotate_f);
    } else if (e.key == "F") {
        animator.push_rotation(CubeState.prototype.rotate_f_ccw);
    }
    else if (e.key == "b") {
        animator.push_rotation(CubeState.prototype.rotate_b);
    } else if (e.key == "B") {
        animator.push_rotation(CubeState.prototype.rotate_b_ccw);
    }
    // Middle slice rotations
    else if (e.key == "m") {
        animator.push_rotation(CubeState.prototype.rotate_m);
    } else if (e.key == "M") {
        animator.push_rotation(CubeState.prototype.rotate_m_ccw);
    }
    else if (e.key == "e") {
        animator.push_rotation(CubeState.prototype.rotate_e);
    } else if (e.key == "E") {
        animator.push_rotation(CubeState.prototype.rotate_e_ccw);
    }
    else if (e.key == "s") {
        animator.push_rotation(CubeState.prototype.rotate_s);
    } else if (e.key == "S") {
        animator.push_rotation(CubeState.prototype.rotate_s_ccw);
    }
    // Whole-cube reorientations
    else if (e.key == "x") {
        animator.push_rotation(CubeState.prototype.rotate_x);
    } else if (e.key == "X") {
        animator.push_rotation(CubeState.prototype.rotate_x_ccw);
    }
    else if (e.key == "y") {
        animator.push_rotation(CubeState.prototype.rotate_y);
    } else if (e.key == "Y") {
        animator.push_rotation(CubeState.prototype.rotate_y_ccw);
    }
    else if (e.key == "z") {
        animator.push_rotation(CubeState.prototype.rotate_z);
    } else if (e.key == "Z") {
        animator.push_rotation(CubeState.prototype.rotate_z_ccw);
    }
});
fscreen.addEventListener("fullscreenchange", function() {
    if (fscreen.fullscreenElement == null) {
        canvas.width = init_canvas_w;
        canvas.height = init_canvas_h;
        text_canvas.width = init_canvas_w;
        text_canvas.height = init_canvas_h;
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
    }
    else {
        canvas.width = screen.width;
        canvas.height = screen.height;
        text_canvas.width = screen.width;
        text_canvas.height = screen.height;
        ctx2d.setTransform(screen.width / init_canvas_w, 0, 0, screen.height / init_canvas_h, 0, 0);
    }
    renderer.change_viewport(canvas);
});

// Timekeeping
let startTime = Date.now();
var lastTime = startTime;

function update(): void {
    // Timekeeping
    let currentTime = Date.now();
    let elapsed = (currentTime - lastTime)/1000.0; // Translate units from ms to seconds
    lastTime = currentTime;

    renderer.draw_state(animator.get_interpolated_state(elapsed));

    ctx2d.clearRect(0, 0, text_canvas.width, text_canvas.height);
    if (show_help) {
        // ? Are there situations where I should show the text even when toggled off? Like fade in after a period of no movements?
        ctx2d.font = "18px monospace";
        var y = 7;
        var dy = 18;
        ctx2d.fillText("R: Rotate right slice", 15, y += dy);
        ctx2d.fillText("L: Rotate left slice",  15, y += dy);
        ctx2d.fillText("U: Rotate top slice", 15, y += dy);
        ctx2d.fillText("D: Rotate bottom slice", 15, y += dy);
        ctx2d.fillText("F: Rotate front slice", 15, y += dy);
        ctx2d.fillText("B: Rotate back slice", 15, y += dy);
        ctx2d.fillText("Hold shift to make a rotation counter-clockwise", 15, y += dy);

        y = 7;
        ctx2d.fillText("M: Rotate the middle (between L and R) slice", 320, y += dy);
        ctx2d.fillText("E: Rotate the equitorial (between U and D) slice", 320, y += dy);
        ctx2d.fillText("S: Rotate the standing (between F and B) slice", 320, y += dy);
        ctx2d.fillText("X: Rotate the cube around the x axis", 320, y += dy);
        ctx2d.fillText("Y: Rotate the cube around the y axis", 320, y += dy);
        ctx2d.fillText("Z: Rotate the cube around the z axis", 320, y += dy);

        y = 7;
        ctx2d.fillText("Enter: Run algorithm", 930, y += dy);
        ctx2d.fillText("Shift+Enter: Invert algorithm", 930, y += dy);
        ctx2d.fillText("Space: Toggle fullscreen", 930, y += dy);
        ctx2d.fillText("H: Toggle this help text", 930, y += dy);
    }

    // Recurse
    requestAnimationFrame(update);
}
update();

let moves_dict = new Map([
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

    // TODO: double-layer turns
]);

let inverse_dict = new Map([
    ["R",   "R\'"],
    ["R\'", "R"],
    ["R2",  "R2"],
    ["M",   "M\'"],
    ["M\'", "M"],
    ["M2",  "M2"],
    ["L",   "L\'"],
    ["L\'", "L"],
    ["L2",  "L2"],

    ["U",   "U\'"],
    ["U\'", "U"],
    ["U2",  "U2"],
    ["E",   "E\'"],
    ["E\'", "E"],
    ["E2",  "E2"],
    ["D",   "D\'"],
    ["D\'", "D"],
    ["D2",  "D2"],

    ["F",   "F\'"],
    ["F\'", "F"],
    ["F2",  "F2"],
    ["S",   "S\'"],
    ["S\'", "S"],
    ["S2",  "S2"],
    ["B",   "B\'"],
    ["B\'", "B"],
    ["B2",  "B2"],

    ["X",   "X\'"],
    ["X\'", "X"],
    ["X2",  "X2"],
    ["Y",   "Y\'"],
    ["Y\'", "Y"],
    ["Y2",  "Y2"],
    ["Z",   "Z\'"],
    ["Z\'", "Z"],
    ["Z2",  "Z2"],
]);

let reset_button = <HTMLButtonElement> document.getElementById("reset");
reset_button.addEventListener("click", function(_e) {
    animator.reset();
});

// ? Not sure if I want to animate this or not
let scramble_button = <HTMLButtonElement> document.getElementById("scramble");
scramble_button.addEventListener("click", function(_e) {
    var scramble_string = "";
    var solution_string = "";

    // Restrict the move space to only standard face operations (can still be 180*)
    let moves_arr = Array.from(moves_dict.entries())
        .filter(entry => {
            let index = ["R", "L", "U", "D", "F", "B"].indexOf(entry[0].substr(0,1));
            return index > -1;
        });

    let num_moves = Math.floor(Math.random() * 10) + 20; // Random number of moves between 20 and 30
    var last_move = -1;
    for (let i = 0; i < num_moves; ++i) {
        var move_index = Math.floor(Math.random()*moves_arr.length);

        // Make sure this move doesn't undo the last one
        while (last_move > -1 && moves_arr[move_index][0] == inverse_dict.get(moves_arr[last_move][0])) {
            move_index = Math.floor(Math.random()*moves_arr.length);
        }

        let move_func = moves_arr[move_index][1];
        animator.push_rotation(move_func);

        scramble_string += ` ${moves_arr[move_index][0]}`;
        solution_string = ` ${inverse_dict.get(moves_arr[move_index][0])}` + solution_string;
        last_move = move_index;
    }

    console.log(`Scramble algorithm: ${scramble_string.substr(1)}`); // substr because the first character is always a space
    console.log(`Solution algorithm: ${solution_string.substr(1)}`);
});

let solve_button = <HTMLButtonElement> document.getElementById("solve");
solve_button.addEventListener("click", function(_e) {
    let solver = new CubeSolver(animator);
    while (!solver.solved()) {
        solver.step();
    }
});

let anim_time_slider = <HTMLInputElement> document.getElementById("anim-time");
anim_time_slider.addEventListener("change", function(_e) {
    animator.animation_duration = anim_time_slider.valueAsNumber;
    console.log(`New animation time: ${animator.animation_duration}`);
});

let alpha_slider = <HTMLInputElement> document.getElementById("alpha");
alpha_slider.addEventListener("change", function(_e) {
    renderer.cubie_alpha = alpha_slider.valueAsNumber;
    console.log(`New cubie opacity:: ${renderer.cubie_alpha}`);
});

let algorithm_text = <HTMLInputElement> document.getElementById("algo-text");
function run_text_algorithm(): void {
    var sandbox = [];
    var errors = false;
    algorithm_text.value.split(" ")
        .filter(v => v != "") // Ignore duplicate, leading, and trailing spaces
        .forEach(move_name => {
            let move_func = moves_dict.get(move_name);
            if (move_func === undefined) {
                alert(`Failed to run algorithm\nUnrecognized move ${move_name}`);
                errors = true;
            }
            else sandbox.push(move_func);
        });

    if (!errors)
        sandbox.forEach(rot => animator.push_rotation(rot));
}

function invert_algorithm(alg: string): string {
    var invert = "";
    var errors = false;
    alg.split(" ")
        .filter(v => v != "") // Ignore duplicate, leading, and trailing spaces
        .forEach(move_name => {
            let inv_name = inverse_dict.get(move_name);
            if (inv_name === undefined) {
                alert(`Failed to invert algorithm\nUnrecognized move ${move_name}`);
                errors = true;
            }
            else invert = ` ${inv_name}` + invert;
        });

    if (!errors) return invert.substr(1);
    else return alg;
}
algorithm_text.addEventListener("keydown", e => {
    if (e.key.toLowerCase() == "enter") {
        if (e.shiftKey) {
            algorithm_text.value = invert_algorithm(algorithm_text.value);
        } else {
            run_text_algorithm();
        }
    }
});
text_canvas.addEventListener("keydown", e => {
    if (e.key.toLowerCase() == "enter") {
        if (e.shiftKey) {
            algorithm_text.value = invert_algorithm(algorithm_text.value);
        } else {
            run_text_algorithm();
        }
    }
});

let run_button = <HTMLButtonElement> document.getElementById("run");
run_button.addEventListener("click", _e => run_text_algorithm());

let invert_button = <HTMLButtonElement> document.getElementById("invert");
invert_button.addEventListener("click", _e => { algorithm_text.value = invert_algorithm(algorithm_text.value) });