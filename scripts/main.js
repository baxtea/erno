define(["require", "exports", "./cube_renderer", "./cube_state", "./fscreen"], function (require, exports, cube_renderer_1, cube_state_1, fscreen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let canvas = document.getElementById("gl-canvas");
    let init_canvas_w = canvas.width;
    let init_canvas_h = canvas.height;
    let renderer = new cube_renderer_1.CubeRenderer(canvas);
    // Bind F to full-screen toggle
    canvas.tabIndex = 1000; // Force the canvas to respond to keyboard events
    canvas.style.outline = "none";
    canvas.addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() == "f") {
            if (fscreen_1.default.fullscreenElement == null)
                fscreen_1.default.requestFullscreen(canvas);
            else
                fscreen_1.default.exitFullscreen();
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
    var state_chain = [cube_state_1.CubeState.default()];
    var current_state = 0;
    // var anim_time = 0.5; // Seconds it takes for one 90-degree rotation of a slice
    // Timekeeping
    let startTime = Date.now();
    var lastTime = startTime;
    function update() {
        // Timekeeping
        let currentTime = Date.now();
        let elapsed = (currentTime - lastTime) / 1000.0; // Translate units from ms to seconds
        lastTime = currentTime;
        renderer.draw_state(state_chain[current_state]);
        // Recurse
        requestAnimationFrame(update);
    }
    update();
});
