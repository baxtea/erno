import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";
import fscreen from "./fscreen";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let init_canvas_w: number = canvas.width;
let init_canvas_h: number = canvas.height;
let renderer = new CubeRenderer(canvas);

// Bind F to full-screen toggle
canvas.tabIndex = 1000; // Force the canvas to respond to keyboard events
canvas.style.outline = "none";
canvas.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() == "f") {
        if (fscreen.fullscreenElement == null)
            fscreen.requestFullscreen(canvas);
        else
            fscreen.exitFullscreen();
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
var state_chain = [CubeState.default()];
var current_state = 0;
// var anim_time = 0.5; // Seconds it takes for one 90-degree rotation of a slice

// Timekeeping
let startTime = Date.now();
var lastTime = startTime;

function update() {
    // Timekeeping
    let currentTime = Date.now();
    let elapsed = (currentTime - lastTime)/1000.0; // Translate units from ms to seconds
    lastTime = currentTime;

    renderer.draw_state(state_chain[current_state])

    // Recurse
    requestAnimationFrame(update);
}
update();