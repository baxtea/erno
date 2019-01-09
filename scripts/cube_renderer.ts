import { CubeState } from "./cube_state";
import mat4 from "../../Common/tsm/mat4";
import fscreen from "./fscreen";
import vec3 from "../../Common/tsm/vec3";

function makeShaderProgram(gl: WebGLRenderingContext, vert_src: string, frag_src: string) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vert_src);
    gl.compileShader(vs);
    if ( !gl.getShaderParameter(vs, gl.COMPILE_STATUS) ) {
        alert(`Vertex shader failed to compile. The error log is: <pre>${gl.getShaderInfoLog(vs)}</pre>`);
        return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, frag_src);
    gl.compileShader(fs);
    if ( !gl.getShaderParameter(fs, gl.COMPILE_STATUS) ) {
        alert(`Vertex shader failed to compile. The error log is: <pre>${gl.getShaderInfoLog(fs)}</pre>`);
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        alert(`Shader program failed to link. The error log is: <pre>${gl.getProgramInfoLog(program)}</pre>`);
        return null;
    }

    return program;
}

// TODO: create alternate renderers/shaders for fancy-shaded

class CubeRenderer {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    readonly init_canvas_w: number;
    readonly init_canvas_h: number;

    model: mat4
    view: mat4;
    projection: mat4;

    shader: WebGLProgram;
    uMVP: WebGLUniformLocation;
    vPosition: number;
    vColor: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.init_canvas_w = canvas.width;
        this.init_canvas_h = canvas.height;

        // Create the WebGL context with the best avavilable implementation
        const names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        this.gl = null;
        for (let i = 0; i < names.length && this.gl == null; ++i) {
            try {
                this.gl = <WebGLRenderingContext> canvas.getContext(names[i], null);
            } catch(e) {}
        }
        let gl = this.gl; // alias
        if (!gl) alert("Failed to create the WebGL context");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.enable(gl.DEPTH_TEST);

        // Declare the shader code
        // For now, they're unlit, and colored per-vertex
        let vs = `
attribute vec4 vPosition;
attribute vec3 vColor;

uniform mat4 uMVP; // Pre-multiplied model,view,projection matrix

varying vec3 fColor;

void main() {
    gl_Position = uMVP*vPosition;
    fColor = vColor;
}`;

        let fs = `
precision mediump float; // Fragment shaders have no default float precision
varying vec3 fColor;

void main() {
    gl_FragColor = vec4(fColor, 1.0);
}`;

        // Compile into a linked program and extract locations for shader variables
        this.shader = makeShaderProgram(gl, vs, fs);
        gl.useProgram(this.shader);

        this.uMVP = gl.getUniformLocation(this.shader, "uMVP");
        this.vPosition = gl.getAttribLocation(this.shader, "vPosition");
        this.vColor = gl.getAttribLocation(this.shader, "vColor");

        // Inititialize the model, view, and projection matrices
        this.model = mat4.identity;
        this.view = mat4.lookAt(new vec3([-2, 0.5, 0.5]), vec3.zero);
        this.projection = mat4.perspective(60, canvas.width/canvas.height, 0.1, 100.0);
    }

    /**
     * Also adjusts the canvas dimensions (and the OpenGL viewport and projection matrix to match)
     *
     * For a successful fullscreen request, should be called in some sort of input callback (mouse or keyboard both work)
     */
    toggle_fullscreen(): void {
        if (fscreen.fullscreenElement == null) {
            fscreen.requestFullscreen(this.canvas);
            this.canvas.width = screen.width;
            this.canvas.height = screen.height;
        }
        else {
            fscreen.exitFullscreen();
            this.canvas.width = this.init_canvas_w;
            this.canvas.height = this.init_canvas_h;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.projection = mat4.perspective(60, this.canvas.width/this.canvas.height, 0.1, 100.0);
    }

    draw_state(state: CubeState): void {
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let mvp = this.projection.multiply(this.view).multiply(this.model);
        gl.uniformMatrix4fv(this.uMVP, false, mvp.all());

        // TODO render each cubie
    }

    interpolate(state1: CubeState, state2: CubeState, t: number): void {
        // ? Move to cube_state.ts
    }
}

export {
    CubeRenderer
}