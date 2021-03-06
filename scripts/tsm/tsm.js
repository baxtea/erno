/*
 * Copyright (c) 2012, 2018 Matthias Ferch
 *
 * Project homepage: https://github.com/matthiasferch/tsm
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
define(["require", "exports", "./mat2", "./mat3", "./mat4", "./quat", "./vec2", "./vec3", "./vec4"], function (require, exports, mat2_1, mat3_1, mat4_1, quat_1, vec2_1, vec3_1, vec4_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        vec2: vec2_1.default, vec3: vec3_1.default, vec4: vec4_1.default,
        mat2: mat2_1.default, mat3: mat3_1.default, mat4: mat4_1.default,
        quat: quat_1.default,
    };
});
