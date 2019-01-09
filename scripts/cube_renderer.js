define(["require", "exports", "../../Common/tsm/mat4", "./fscreen", "../../Common/tsm/vec3", "../../Common/tsm/quat"], function (require, exports, mat4_1, fscreen_1, vec3_1, quat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeShaderProgram(gl, vert_src, frag_src) {
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vert_src);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            alert(`Vertex shader failed to compile. The error log is: <pre>${gl.getShaderInfoLog(vs)}</pre>`);
            return null;
        }
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, frag_src);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            alert(`Vertex shader failed to compile. The error log is: <pre>${gl.getShaderInfoLog(fs)}</pre>`);
            return null;
        }
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert(`Shader program failed to link. The error log is: <pre>${gl.getProgramInfoLog(program)}</pre>`);
            return null;
        }
        return program;
    }
    class CubeRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.init_canvas_w = canvas.width;
            this.init_canvas_h = canvas.height;
            // Create the WebGL context with the best avavilable implementation
            const names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            this.gl = null;
            for (let i = 0; i < names.length && this.gl == null; ++i) {
                try {
                    this.gl = canvas.getContext(names[i], null);
                }
                catch (e) { }
            }
            let gl = this.gl; // alias
            if (!gl)
                alert("Failed to create the WebGL context");
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.5, 0.5, 0.5, 1);
            gl.enable(gl.DEPTH_TEST);
            // Create the quad used to render each sticker
            // No index buffer, counter-clockwise so they survive backface culling
            // ? Not sure -0.5 makes the most sense for the z position
            let verts = new Float32Array([
                -0.4, -0.4, -0.4,
                0.4, -0.4, -0.4,
                0.4, 0.4, -0.4,
                -0.4, -0.4, -0.4,
                0.4, 0.4, -0.4,
                -0.4, 0.4, -0.4,
            ]);
            this.quad = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            // Fill in the dictionary used to map each face to an RGB color
            function hex_to_rgb(hex) {
                let r = (((hex) >> 16) & 0xFF) / 255.0;
                let g = (((hex) >> 8) & 0xFF) / 255.0;
                let b = ((hex) & 0xFF) / 255.0;
                return new vec3_1.default([r, g, b]);
            }
            //                   red      orange    yellow     green     blue      white
            this.face_colors = [0xb71234, 0xFF5800, 0xFFD500, 0x009B48, 0x0046AD, 0xFFFFFF].map(hex_to_rgb);
            // Declare the shader code
            // For now, they're unlit, and colored per-vertex
            let vs = `
attribute vec4 vPosition;
uniform mat4 uMVP; // Pre-multiplied model,view,projection matrix

void main() {
    gl_Position = uMVP*vPosition;
}`;
            let fs = `
precision mediump float; // Fragment shaders have no default float precision
uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}`;
            // Compile into a linked program and extract locations for shader variables
            this.shader = makeShaderProgram(gl, vs, fs);
            gl.useProgram(this.shader);
            this.uMVP = gl.getUniformLocation(this.shader, "uMVP");
            this.uColor = gl.getUniformLocation(this.shader, "uColor");
            this.vPosition = gl.getAttribLocation(this.shader, "vPosition");
            // Inititialize the model, view, and projection matrices
            this.model = mat4_1.default.identity;
            this.view = mat4_1.default.lookAt(new vec3_1.default([2, 2, -5]), vec3_1.default.zero);
            this.projection = mat4_1.default.perspective(60, canvas.width / canvas.height, 0.1, 100.0);
        }
        /**
         * Also adjusts the canvas dimensions (and the OpenGL viewport and projection matrix to match)
         *
         * For a successful fullscreen request, should be called in some sort of input callback (mouse or keyboard both work)
         */
        toggle_fullscreen() {
            if (fscreen_1.default.fullscreenElement == null) {
                fscreen_1.default.requestFullscreen(this.canvas);
                this.canvas.width = screen.width;
                this.canvas.height = screen.height;
            }
            else {
                fscreen_1.default.exitFullscreen();
                this.canvas.width = this.init_canvas_w;
                this.canvas.height = this.init_canvas_h;
            }
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.projection = mat4_1.default.perspective(60, this.canvas.width / this.canvas.height, 0.1, 100.0);
        }
        /**
         * ! Requires this.quad to be bound to gl.ARRAY_BUFFER and position attribute enabled
         */
        draw_cubie(cubie) {
            let gl = this.gl;
            let vp = this.projection.copy().multiply(this.view);
            for (let x = 0; x <= 1; ++x) {
                let mirror = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2 + Math.PI * x);
                let face_orientation = mirror.multiply(cubie.orientation);
                let face_translation = mat4_1.default.identity.copy().translate(cubie.position);
                var model = face_translation.multiply(face_orientation.toMat4());
                let mvp = vp.copy().multiply(model);
                gl.uniformMatrix4fv(this.uMVP, false, mvp.all());
                if (cubie.faces[x] != null) {
                    gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[x]].xyz);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
            }
            for (let y = 0; y <= 1; ++y) {
                let mirror = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2 + Math.PI * y);
                let face_orientation = mirror.multiply(cubie.orientation);
                let face_translation = mat4_1.default.identity.copy().translate(cubie.position);
                var model = face_translation.multiply(face_orientation.toMat4());
                let mvp = vp.copy().multiply(model);
                gl.uniformMatrix4fv(this.uMVP, false, mvp.all());
                if (cubie.faces[2 + y] != null) {
                    gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[2 + y]].xyz);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
            }
            for (let z = 0; z <= 1; ++z) {
                let mirror = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI * z);
                let face_orientation = mirror.multiply(cubie.orientation);
                let face_translation = mat4_1.default.identity.copy().translate(cubie.position);
                var model = face_translation.multiply(face_orientation.toMat4());
                let mvp = vp.copy().multiply(model);
                gl.uniformMatrix4fv(this.uMVP, false, mvp.all());
                if (cubie.faces[4 + z] != null) {
                    gl.uniform3fv(this.uColor, this.face_colors[cubie.faces[4 + z]].xyz);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
            }
        }
        draw_state(state) {
            let gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
            gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.vPosition);
            // this.draw_cubie(state.cubies[0])
            state.cubies.forEach(cubie => {
                this.draw_cubie(cubie);
            });
            gl.disableVertexAttribArray(this.vPosition);
        }
    }
    exports.CubeRenderer = CubeRenderer;
});
