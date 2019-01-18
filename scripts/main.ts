import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";
import fscreen from "./fscreen";
import { CubeSolver } from "./cube_solver";
import { CubeAnimator } from "./cube_animator";
import quat from "./tsm/quat";
import vec3 from "./tsm/vec3";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let init_canvas_w: number = canvas.width;
let init_canvas_h: number = canvas.height;
let renderer = new CubeRenderer(canvas);
let animator = new CubeAnimator(0.2);

let canvas_div = <HTMLDivElement> document.getElementsByClassName("canvas-container")[0];
let text_canvas = <HTMLCanvasElement> document.getElementById("text-canvas");
let ctx2d = text_canvas.getContext("2d");
var show_help = true;

var rotx = quat.identity.copy();
var roty = quat.identity.copy();

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
text_canvas.addEventListener("mouseleave", function(_e) {
    rotx = quat.identity.copy();
    roty = quat.identity.copy();
});
text_canvas.addEventListener("mousemove", function(e) {
    if (text_canvas === document.activeElement) {
        let rect = canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / (rect.width/2) - 1;
        let y = (rect.top - e.clientY) / (rect.height/2) + 1;

        rotx = quat.fromAxisAngle(vec3.up, x**3 * Math.PI/2);
        roty = quat.fromAxisAngle(vec3.right, y**3 * -Math.PI/2);
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

    renderer.model = quat.mix(renderer.model, rotx.copy().multiply(roty), 0.25);

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
    ["R",    CubeState.prototype.rotate_r],
    ["R\'",  CubeState.prototype.rotate_r_ccw],
    ["R2",   CubeState.prototype.rotate_r2],
    ["M",    CubeState.prototype.rotate_m],
    ["M\'",  CubeState.prototype.rotate_m_ccw],
    ["M2",   CubeState.prototype.rotate_m2],
    ["L",    CubeState.prototype.rotate_l],
    ["L\'",  CubeState.prototype.rotate_l_ccw],
    ["L2",   CubeState.prototype.rotate_l2],

    ["U",    CubeState.prototype.rotate_u],
    ["U\'",  CubeState.prototype.rotate_u_ccw],
    ["U2",   CubeState.prototype.rotate_u2],
    ["E",    CubeState.prototype.rotate_e],
    ["E\'",  CubeState.prototype.rotate_e_ccw],
    ["E2",   CubeState.prototype.rotate_e2],
    ["D",    CubeState.prototype.rotate_d],
    ["D\'",  CubeState.prototype.rotate_d_ccw],
    ["D2",   CubeState.prototype.rotate_d2],

    ["F",    CubeState.prototype.rotate_f],
    ["F\'",  CubeState.prototype.rotate_f_ccw],
    ["F2",   CubeState.prototype.rotate_f2],
    ["S",    CubeState.prototype.rotate_s],
    ["S\'",  CubeState.prototype.rotate_s_ccw],
    ["S2",   CubeState.prototype.rotate_s2],
    ["B",    CubeState.prototype.rotate_b],
    ["B\'",  CubeState.prototype.rotate_b_ccw],
    ["B2",   CubeState.prototype.rotate_b2],

    ["X",    CubeState.prototype.rotate_x],
    ["X\'",  CubeState.prototype.rotate_x_ccw],
    ["X2",   CubeState.prototype.rotate_x2],
    ["Y",    CubeState.prototype.rotate_y],
    ["Y\'",  CubeState.prototype.rotate_y_ccw],
    ["Y2",   CubeState.prototype.rotate_y2],
    ["Z",    CubeState.prototype.rotate_z],
    ["Z\'",  CubeState.prototype.rotate_z_ccw],
    ["Z2",   CubeState.prototype.rotate_z2],

    ["r",    CubeState.prototype.rotate_rw],
    ["Rw",   CubeState.prototype.rotate_rw],
    ["r\'",  CubeState.prototype.rotate_rw_ccw],
    ["Rw\'", CubeState.prototype.rotate_rw_ccw],
    ["r2",   CubeState.prototype.rotate_rw2],
    ["Rw2",  CubeState.prototype.rotate_rw2],

    ["l",    CubeState.prototype.rotate_lw],
    ["Lw",   CubeState.prototype.rotate_lw],
    ["l\'",  CubeState.prototype.rotate_lw_ccw],
    ["Lw\'", CubeState.prototype.rotate_lw_ccw],
    ["l2",   CubeState.prototype.rotate_lw2],
    ["Lw2",  CubeState.prototype.rotate_lw2],

    ["u",    CubeState.prototype.rotate_uw],
    ["Uw",   CubeState.prototype.rotate_uw],
    ["u\'",  CubeState.prototype.rotate_uw_ccw],
    ["Uw\'", CubeState.prototype.rotate_uw_ccw],
    ["u2",   CubeState.prototype.rotate_uw2],
    ["Uw2",  CubeState.prototype.rotate_uw2],

    ["d",    CubeState.prototype.rotate_dw],
    ["Dw",   CubeState.prototype.rotate_dw],
    ["d\'",  CubeState.prototype.rotate_dw_ccw],
    ["Dw\'", CubeState.prototype.rotate_dw_ccw],
    ["d2",   CubeState.prototype.rotate_dw2],
    ["Dw2",  CubeState.prototype.rotate_dw2],

    ["f",    CubeState.prototype.rotate_fw],
    ["Fw",   CubeState.prototype.rotate_fw],
    ["f\'",  CubeState.prototype.rotate_fw_ccw],
    ["Fw\'", CubeState.prototype.rotate_fw_ccw],
    ["f2",   CubeState.prototype.rotate_fw2],
    ["Fw2",  CubeState.prototype.rotate_fw2],

    ["b",    CubeState.prototype.rotate_bw],
    ["Bw",   CubeState.prototype.rotate_bw],
    ["b\'",  CubeState.prototype.rotate_bw_ccw],
    ["Bw\'", CubeState.prototype.rotate_bw_ccw],
    ["b2",   CubeState.prototype.rotate_bw2],
    ["Bw2",  CubeState.prototype.rotate_bw2],
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

    ["r",    "r\'"],
    ["Rw",   "Rw\'"],
    ["r\'",  "r"],
    ["Rw\'", "Rw"],
    ["r2",   "r2"],
    ["Rw2",  "Rw2"],

    ["l",    "l\'"],
    ["Lw",   "Lw\'"],
    ["l\'",  "l"],
    ["Lw\'", "Lw"],
    ["l2",   "l2\'"],
    ["Lw2",  "Lw2"],

    ["u",    "u\'"],
    ["Uw",   "Uw\'"],
    ["u\'",  "u"],
    ["Uw\'", "Uw"],
    ["u2",   "u2"],
    ["Uw2",  "Uw2"],

    ["d",    "d\'"],
    ["Dw",   "Dw\'"],
    ["d\'",  "d"],
    ["Dw\'", "Dw"],
    ["d2",   "d2"],
    ["Dw2",  "Dw2"],

    ["f",    "f\'"],
    ["Fw",   "Fw\'"],
    ["f\'",  "f"],
    ["Fw\'", "Fw"],
    ["f2",   "f2"],
    ["Fw2",  "Fw2"],

    ["b",    "b\'"],
    ["Bw",   "Bw\'"],
    ["b\'",  "b"],
    ["Bw\'", "Bw"],
    ["b2",   "b2"],
    ["Bw2",  "Bw2"],
]);

let reset_button = <HTMLButtonElement> document.getElementById("reset");
reset_button.addEventListener("click", function(_e) {
    animator.reset();
});

// ? Not sure if I want to animate this or not
let scramble_button = <HTMLButtonElement> document.getElementById("scramble");
scramble_button.addEventListener("click", function(_e) {
    var scramble_string = "";

    // Restrict the move space to only standard face operations (can still be 180*)
    var moves_arr = ["R", "L", "U", "D", "F", "B"];
    moves_arr = moves_arr.concat(
        moves_arr.map(c => `${c}\'`),
        moves_arr.map(c => `${c}2`));

    let num_moves = Math.floor(Math.random() * 10) + 20; // Random number of moves between 20 and 30
    var last_move = -1;
    for (let i = 0; i < num_moves; ++i) {
        var move_index = Math.floor(Math.random()*moves_arr.length);

        // Make sure this is turning a different face than last time
        while (last_move > -1 && moves_arr[move_index][0] == moves_arr[last_move][0]) {
            move_index = Math.floor(Math.random()*moves_arr.length);
        }

        let move_func = moves_dict.get(moves_arr[move_index]);
        animator.push_rotation(move_func);

        scramble_string += ` ${moves_arr[move_index]}`;
        last_move = move_index;
    }

    console.log(`Scramble algorithm: ${scramble_string.substr(1)}`); // substr because the first character is always a space
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