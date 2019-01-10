define(["require", "exports", "./cube_renderer", "./cube_state", "./fscreen", "./cube_solver"], function (require, exports, cube_renderer_1, cube_state_1, fscreen_1, cube_solver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let canvas = document.getElementById("gl-canvas");
    let init_canvas_w = canvas.width;
    let init_canvas_h = canvas.height;
    let renderer = new cube_renderer_1.CubeRenderer(canvas);
    // Bind F to full-screen toggle
    canvas.tabIndex = 0; // Force the canvas to respond to keyboard events
    canvas.style.outline = "none";
    canvas.addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() == "enter") {
            if (fscreen_1.default.fullscreenElement == null)
                fscreen_1.default.requestFullscreen(canvas);
            else
                fscreen_1.default.exitFullscreen();
        }
        else if (e.key == "\`") {
            console.log(current_state);
        }
        // Face rotations
        else if (e.key == "r") {
            current_state = current_state.rotate_r();
        }
        else if (e.key == "R") {
            current_state = current_state.rotate_r_ccw();
        }
        else if (e.key == "l") {
            current_state = current_state.rotate_l();
        }
        else if (e.key == "L") {
            current_state = current_state.rotate_l_ccw();
        }
        else if (e.key == "u") {
            current_state = current_state.rotate_u();
        }
        else if (e.key == "U") {
            current_state = current_state.rotate_u_ccw();
        }
        else if (e.key == "d") {
            current_state = current_state.rotate_d();
        }
        else if (e.key == "D") {
            current_state = current_state.rotate_d_ccw();
        }
        else if (e.key == "f") {
            current_state = current_state.rotate_f();
        }
        else if (e.key == "F") {
            current_state = current_state.rotate_f_ccw();
        }
        else if (e.key == "b") {
            current_state = current_state.rotate_b();
        }
        else if (e.key == "B") {
            current_state = current_state.rotate_b_ccw();
        }
        // Middle slice rotations
        else if (e.key == "m") {
            current_state = current_state.rotate_m();
        }
        else if (e.key == "M") {
            current_state = current_state.rotate_m_ccw();
        }
        else if (e.key == "e") {
            current_state = current_state.rotate_e();
        }
        else if (e.key == "E") {
            current_state = current_state.rotate_e_ccw();
        }
        else if (e.key == "s") {
            current_state = current_state.rotate_s();
        }
        else if (e.key == "S") {
            current_state = current_state.rotate_s_ccw();
        }
        // Whole-cube reorientations
        else if (e.key == "x") {
            current_state = current_state.rotate_x();
        }
        else if (e.key == "X") {
            current_state = current_state.rotate_x_ccw();
        }
        else if (e.key == "y") {
            current_state = current_state.rotate_y();
        }
        else if (e.key == "Y") {
            current_state = current_state.rotate_y_ccw();
        }
        else if (e.key == "z") {
            current_state = current_state.rotate_z();
        }
        else if (e.key == "Z") {
            current_state = current_state.rotate_z_ccw();
        }
    });
    fscreen_1.default.addEventListener("fullscreenchange", function () {
        if (fscreen_1.default.fullscreenElement == null) {
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
    var current_state = cube_state_1.CubeState.default();
    var anim_time = 0.0; // Seconds it takes for one slice action (usually a 90* rotation)
    // Timekeeping
    let startTime = Date.now();
    var lastTime = startTime;
    function update() {
        // Timekeeping
        let currentTime = Date.now();
        let elapsed = (currentTime - lastTime) / 1000.0; // Translate units from ms to seconds
        lastTime = currentTime;
        // renderer.draw_state(animator.get_interpolated_state(elapsed));
        renderer.draw_state(current_state);
        // Recurse
        requestAnimationFrame(update);
    }
    update();
    let reset_button = document.getElementById("reset");
    reset_button.addEventListener("click", function (_e) {
        current_state = cube_state_1.CubeState.default();
        // animator.reset();
    });
    let scramble_button = document.getElementById("scramble");
    scramble_button.addEventListener("click", function (_e) {
        // ? Not sure if I want to animate this or not
        // If so, would have to be at a very high speed so it couldn't be
        let moves = [
            cube_state_1.CubeState.prototype.rotate_r,
            cube_state_1.CubeState.prototype.rotate_r_ccw,
            cube_state_1.CubeState.prototype.rotate_r2,
            cube_state_1.CubeState.prototype.rotate_m,
            cube_state_1.CubeState.prototype.rotate_m_ccw,
            cube_state_1.CubeState.prototype.rotate_m2,
            cube_state_1.CubeState.prototype.rotate_l,
            cube_state_1.CubeState.prototype.rotate_l_ccw,
            cube_state_1.CubeState.prototype.rotate_l2,
            cube_state_1.CubeState.prototype.rotate_u,
            cube_state_1.CubeState.prototype.rotate_u_ccw,
            cube_state_1.CubeState.prototype.rotate_u2,
            cube_state_1.CubeState.prototype.rotate_e,
            cube_state_1.CubeState.prototype.rotate_e_ccw,
            cube_state_1.CubeState.prototype.rotate_e2,
            cube_state_1.CubeState.prototype.rotate_d,
            cube_state_1.CubeState.prototype.rotate_d_ccw,
            cube_state_1.CubeState.prototype.rotate_d2,
            cube_state_1.CubeState.prototype.rotate_f,
            cube_state_1.CubeState.prototype.rotate_f_ccw,
            cube_state_1.CubeState.prototype.rotate_f2,
            cube_state_1.CubeState.prototype.rotate_s,
            cube_state_1.CubeState.prototype.rotate_s_ccw,
            cube_state_1.CubeState.prototype.rotate_s2,
            cube_state_1.CubeState.prototype.rotate_b,
            cube_state_1.CubeState.prototype.rotate_b_ccw,
            cube_state_1.CubeState.prototype.rotate_b2,
        ];
        let num_moves = Math.floor(Math.random() * 10) + 30; // Random number of moves between 30 and 40
        for (let i = 0; i < num_moves; ++i) {
            let chosen_move = moves[Math.floor(Math.random() * moves.length)];
            current_state = chosen_move.call(current_state);
            // animator.push_rotation(chosen_move);
        }
    });
    let solve_button = document.getElementById("solve");
    solve_button.addEventListener("click", function (_e) {
        let solver = new cube_solver_1.CubeSolver(current_state);
        while (!solver.solved()) {
            solver.step();
        }
    });
    let anim_time_slider = document.getElementById("anim-time");
    anim_time_slider.addEventListener("change", function (_e) {
        anim_time = Number.parseFloat(anim_time_slider.value);
        console.log(`New animation time: ${anim_time}`);
    });
});
