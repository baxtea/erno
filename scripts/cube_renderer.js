define(["require", "exports", "../../Common/tsm/mat4", "./fscreen", "../../Common/tsm/vec3"], function (require, exports, mat4_1, fscreen_1, vec3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeShaderProgram(gl, vert_src, frag_src) {
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vert_src);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            alert("Vertex shader failed to compile. The error log is: <pre>" + gl.getShaderInfoLog(vs) + "</pre>");
            return null;
        }
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, frag_src);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            alert("Vertex shader failed to compile. The error log is: <pre>" + gl.getShaderInfoLog(fs) + "</pre>");
            return null;
        }
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("Shader program failed to link. The error log is: <pre>" + gl.getProgramInfoLog(program) + "</pre>");
            return null;
        }
        return program;
    }
    // TODO: create alternate renderers/shaders for fancy-shaded
    var CubeRenderer = /** @class */ (function () {
        function CubeRenderer(canvas) {
            this.canvas = canvas;
            this.init_canvas_w = canvas.width;
            this.init_canvas_h = canvas.height;
            // Create the WebGL context with the best avavilable implementation
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            this.gl = null;
            for (var i = 0; i < names.length && this.gl == null; ++i) {
                try {
                    this.gl = canvas.getContext(names[i], null);
                }
                catch (e) { }
            }
            var gl = this.gl; // alias
            if (!gl)
                alert("Failed to create the WebGL context");
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.5, 0.5, 0.5, 1);
            gl.enable(gl.DEPTH_TEST);
            // Declare the shader code
            // For now, they're unlit, and colored per-vertex
            var vs = "\nattribute vec4 vPosition;\nattribute vec3 vColor;\n\nuniform mat4 uMVP; // Pre-multiplied model,view,projection matrix\n\nvarying vec3 fColor;\n\nvoid main() {\n    gl_Position = uMVP*vPosition;\n    fColor = vColor;\n}";
            var fs = "\nprecision mediump float; // Fragment shaders have no default float precision\nvarying vec3 fColor;\n\nvoid main() {\n    gl_FragColor = vec4(fColor, 1.0);\n}";
            // Compile into a linked program and extract locations for shader variables
            this.shader = makeShaderProgram(gl, vs, fs);
            gl.useProgram(this.shader);
            this.uMVP = gl.getUniformLocation(this.shader, "uMVP");
            this.vPosition = gl.getAttribLocation(this.shader, "vPosition");
            this.vColor = gl.getAttribLocation(this.shader, "vColor");
            // Inititialize the model, view, and projection matrices
            this.model = mat4_1.default.identity;
            this.view = mat4_1.default.lookAt(new vec3_1.default([-2, 0.5, 0.5]), vec3_1.default.zero);
            this.projection = mat4_1.default.perspective(60, canvas.width / canvas.height, 0.1, 100.0);
        }
        /**
         * Also adjusts the canvas dimensions (and the OpenGL viewport and projection matrix to match)
         *
         * For a successful fullscreen request, should be called in some sort of input callback (mouse or keyboard both work)
         */
        CubeRenderer.prototype.toggle_fullscreen = function () {
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
        };
        CubeRenderer.prototype.draw_state = function (state) {
            var gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var mvp = this.projection.multiply(this.view).multiply(this.model);
            gl.uniformMatrix4fv(this.uMVP, false, mvp.all());
            // TODO render each cubie
        };
        CubeRenderer.prototype.interpolate = function (state1, state2, t) {
            // ? Move to cube_state.ts
        };
        return CubeRenderer;
    }());
    exports.CubeRenderer = CubeRenderer;
});
