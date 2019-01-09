import { CubeState, Cubie } from "./cube_state";
import mat4 from "../../Common/tsm/mat4";
import fscreen from "./fscreen";
import vec3 from "../../Common/tsm/vec3";
import quat from "../../Common/tsm/quat";

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

/**
 * More accurately, this is a sticker renderer
 */
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
    uColor: WebGLUniformLocation;
    uStickerScale: WebGLUniformLocation;
    vPosition: number;

    quad: WebGLBuffer;
    cube: WebGLBuffer;
    cube_indices: WebGLBuffer;
    cube_index_count: number;
    face_colors: vec3[];

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

        // Create the quad used to render each sticker
        // No index buffer, counter-clockwise so they survive backface culling
        let quad_verts = new Float32Array([
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,

            -0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,
        ]);
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, quad_verts, gl.STATIC_DRAW);

        // Create the beveled cube used to render each cubie pre-sticker (see cubie.obj for source; created in Blender)
        let cube_verts = new Float32Array([
            0,0,0,
             0.499000, -0.432251, -0.432250,
             0.432251, -0.499000, -0.432251,
             0.432251, -0.432251, -0.499000,
             0.499000, -0.432251,  0.432251,
             0.432251, -0.432251,  0.499000,
             0.432251, -0.499000,  0.432251,
            -0.432251, -0.432251,  0.499000,
            -0.499000, -0.432251,  0.432250,
            -0.432251, -0.499000,  0.432250,
            -0.432250, -0.432251, -0.499000,
            -0.432250, -0.499000, -0.432251,
            -0.499000, -0.432251, -0.432251,
             0.432251,  0.432251, -0.499000,
             0.432251,  0.499000, -0.432250,
             0.499000,  0.432251, -0.432250,
             0.432250,  0.432251,  0.499000,
             0.499000,  0.432251,  0.432251,
             0.432250,  0.499000,  0.432251,
            -0.499000,  0.432251,  0.432250,
            -0.432251,  0.432251,  0.499000,
            -0.432251,  0.499000,  0.432250,
            -0.499000,  0.432251, -0.432251,
            -0.432251,  0.499000, -0.432251,
            -0.432251,  0.432251, -0.499000,
        ]);
        this.cube = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube);
        gl.bufferData(gl.ARRAY_BUFFER, cube_verts, gl.STATIC_DRAW);

        let cube_indices = new Uint16Array([
             3, 24, 13,
             2,  9, 11,
             8, 22, 12,
            23, 18, 14,
            16,  7,  5,
             1,  2,  3,
             4,  5,  6,
             7,  8,  9,
            10, 11, 12,
            13, 14, 15,
            16, 17, 18,
            19, 20, 21,
            22, 23, 24,
             1,  6,  2,
             2, 10,  3,
            13,  1,  3,
             5,  9,  6,
            17,  5,  4,
            12,  9,  8,
            20,  8,  7,
            12, 24, 10,
            14, 17, 15,
            13, 23, 14,
            18, 20, 16,
            23, 19, 21,
            15,  4,  1,
             3, 10, 24,
             2,  6,  9,
             8, 19, 22,
            23, 21, 18,
            16, 20,  7,
             1,  4,  6,
             2, 11, 10,
            13, 15,  1,
             5,  7,  9,
            17, 16,  5,
            12, 11,  9,
            20, 19,  8,
            12, 22, 24,
            14, 18, 17,
            13, 24, 23,
            18, 21, 20,
            23, 22, 19,
            15, 17,  4,
        ]);
        this.cube_indices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube_indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube_indices, gl.STATIC_DRAW);
        this.cube_index_count = cube_indices.length;

        // Fill in the dictionary used to map each face to an RGB color
        function hex_to_rgb(hex: number) {
            let r = (((hex) >> 16) & 0xFF) / 255.0;
            let g = (((hex) >> 8) & 0xFF) / 255.0;
            let b = ((hex) & 0xFF) / 255.0;
            return new vec3([r, g, b]);
        }
        //                   red      orange    yellow     green     blue      white
        this.face_colors = [0xb71234, 0xFF5800, 0xFFD500, 0x009B48, 0x0046AD, 0xFFFFFF].map(hex_to_rgb);

        // Declare the shader code
        // For now, they're unlit, and colored per-vertex
        let vs = `
attribute vec4 vPosition;
uniform mat4 uMVP; // Pre-multiplied model,view,projection matrix
uniform float uStickerScale;

void main() {
    gl_Position = uMVP * vec4(uStickerScale*vPosition.xy, vPosition.z, 1.0);
}`;

        let fs = `
precision highp float; // Fragment shaders have no default float precision
uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}`;

        // Compile into a linked program and extract locations for shader variables
        this.shader = makeShaderProgram(gl, vs, fs);
        gl.useProgram(this.shader);

        this.uMVP = gl.getUniformLocation(this.shader, "uMVP");
        this.uColor = gl.getUniformLocation(this.shader, "uColor");
        this.uStickerScale = gl.getUniformLocation(this.shader, "uStickerScale");
        this.vPosition = gl.getAttribLocation(this.shader, "vPosition");

        // Inititialize the model, view, and projection matrices
        this.model = mat4.identity;
        this.view = mat4.lookAt(new vec3([2, 2, 5]), vec3.zero);
        this.projection = mat4.perspective(60, canvas.width/canvas.height, 0.1, 100.0);
    }

    /**
     * Also adjusts the canvas dimensions (and the OpenGL viewport and projection matrix to match)
     *
     * For a successful fullscreen request, should be called in some sort of input callback (mouse or keyboard both work)
     */
    toggle_fullscreen(): void {
        if (fscreen.fullscreenElement == null) {
            this.canvas.width = screen.width;
            this.canvas.height = screen.height;
            fscreen.requestFullscreen(this.canvas);
        }
        else {
            fscreen.exitFullscreen();
            this.canvas.width = this.init_canvas_w;
            this.canvas.height = this.init_canvas_h;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.projection = mat4.perspective(60, this.canvas.width/this.canvas.height, 0.1, 100.0);
    }
    /**
     * ! Requires the position attribute enabled
     */
    private draw_cubie(cubie: Cubie, sticker_scale: number, vp: mat4): void {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1f(this.uStickerScale, sticker_scale);

        for (let x = 0; x <= 1; ++x) {
            let mirror = quat.fromAxisAngle(vec3.up, Math.PI/2 + Math.PI*x);
            let face_orientation = mirror.multiply(cubie.orientation);
            let face_translation = mat4.identity.copy().translate(cubie.position);

            var model = face_translation.multiply(face_orientation.toMat4());
            let mvp = vp.copy().multiply(model);
            gl.uniformMatrix4fv(this.uMVP, false, mvp.all());

            if (cubie.faces[x] != null) {
                gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[x]].xyz);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }
        for (let y = 0; y <= 1; ++y) {
            let mirror = quat.fromAxisAngle(vec3.right, -Math.PI/2 + Math.PI*y);
            let face_orientation = mirror.multiply(cubie.orientation);
            let face_translation = mat4.identity.copy().translate(cubie.position);

            var model = face_translation.multiply(face_orientation.toMat4());
            let mvp = vp.copy().multiply(model);
            gl.uniformMatrix4fv(this.uMVP, false, mvp.all());

            if (cubie.faces[2 + y] != null) {
                gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[2 + y]].xyz);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }
        for (let z = 0; z <= 1; ++z) {
            let mirror = quat.fromAxisAngle(vec3.up, Math.PI*z);
            let face_orientation = mirror.multiply(cubie.orientation);
            let face_translation = mat4.identity.copy().translate(cubie.position);

            var model = face_translation.multiply(face_orientation.toMat4());
            let mvp = vp.copy().multiply(model);
            gl.uniformMatrix4fv(this.uMVP, false, mvp.all());

            if (cubie.faces[4 + z] != null) {
                gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[4 + z]].xyz);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube_indices);
        gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.uMVP, false, vp.copy().multiply(mat4.identity.copy().translate(cubie.position)).all());
        gl.uniform3f(this.uColor, 0, 0, 0);
        gl.uniform1f(this.uStickerScale, 1.0);
        gl.drawElements(gl.TRIANGLES, this.cube_index_count, gl.UNSIGNED_SHORT, 0);
    }

    draw_state(state: CubeState, sticker_scale = 0.8): void {
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enableVertexAttribArray(this.vPosition);

        let vp = this.projection.copy().multiply(this.view);
        state.cubies.forEach(cubie => {
            this.draw_cubie(cubie, sticker_scale, vp);
        });

        gl.disableVertexAttribArray(this.vPosition);
    }

    // TODO implement interpolation
    // interpolate(state1: CubeState, state2: CubeState, t: number): void {
    //     // ? Move to cube_state.ts
    // }
}

export {
    CubeRenderer
}