const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load WASM
const { instance } = await WebAssembly.instantiateStreaming(fetch("model.wasm"));
const exports = instance.exports;
const memory = exports.memory;

// === Get Model Data from WASM ===
const vertexPtr = exports.get_model_vertex_ptr();
const vertexCount = exports.get_model_vertex_count();
const vertexData = new Float32Array(memory.buffer, vertexPtr, vertexCount * 5); // x,y,z,u,v

const indexPtr = exports.get_model_index_ptr();
const indexCount = exports.get_model_index_count();
const indexData = new Uint16Array(memory.buffer, indexPtr, indexCount);

const texturePtr = exports.get_texture_ptr();
const textureData = new Uint8Array(memory.buffer, texturePtr, 256 * 256 * 4); // RGBA

// === Create Texture ===
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// === Shaders ===
const vsSource = `
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
uniform mat4 uProjection;
void main() {
  vUV = aUV;
  gl_Position = uProjection * vec4(aPosition, 1.0);
}
`;

const fsSource = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
void main() {
  gl_FragColor = texture2D(uTexture, vUV);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

const vs = createShader(gl.VERTEX_SHADER, vsSource);
const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

// === Upload Buffers ===
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
const aUV = gl.getAttribLocation(program, "aUV");

gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 20, 0); // 3 floats @ 0

gl.enableVertexAttribArray(aUV);
gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 20, 12); // 2 floats @ byte offset 12

// === Projection Matrix (orthographic or perspective) ===
const projection = new Float32Array([
  1.5, 0,   0, 0,
  0,   1.5, 0, 0,
  0,   0,   1, 0,
  0,   0,   0, 1
]);
const uProjection = gl.getUniformLocation(program, "uProjection");
gl.uniformMatrix4fv(uProjection, false, projection);

// === Texture Uniform ===
gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

// === Clear and Draw ===
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

