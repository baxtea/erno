import { CubeRenderer } from "./cube_renderer";
import { CubeState } from "./cube_state";

let canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");
let renderer = new CubeRenderer(canvas);

// Bind F to full-screen toggle
document.onkeydown = function(e: KeyboardEvent) {
    if (e.key.toLowerCase() == "f")
        renderer.toggle_fullscreen();
};

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
    //requestAnimationFrame(update);
}
update();