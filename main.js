gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Module.HEAPF32.buffer, ptr_vertices, vertexCount*3), gl.STATIC_DRAW);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(Module.HEAPU32.buffer, ptr_indices, indexCount*3), gl.STATIC_DRAW);

// Load WASM
const { instance } = await WebAssembly.instantiateStreaming(fetch("model.wasm"));
const exports = instance.exports;
const memory = exports.memory;


