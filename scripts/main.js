define(["require", "exports", "./cube_renderer", "./cube_state"], function (require, exports, cube_renderer_1, cube_state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById("gl-canvas");
    var renderer = new cube_renderer_1.CubeRenderer(canvas);
    // Bind F to full-screen toggle
    document.onkeydown = function (e) {
        if (e.key.toLowerCase() == "f")
            renderer.toggle_fullscreen();
    };
    // Animation details
    var state_chain = [cube_state_1.CubeState.default()];
    var current_state = 0;
    // var anim_time = 0.5; // Seconds it takes for one 90-degree rotation of a slice
    // Timekeeping
    var startTime = Date.now();
    var lastTime = startTime;
    function update() {
        // Timekeeping
        var currentTime = Date.now();
        var elapsed = (currentTime - lastTime) / 1000.0; // Translate units from ms to seconds
        lastTime = currentTime;
        // Basically a no-op at this point in time
        renderer.draw_state(state_chain[current_state]);
        // Recurse
        requestAnimationFrame(update);
    }
    update();
});
