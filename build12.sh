#!/bin/bash

set -e  # Exit on error

# Output file
OUTFILE="game.wasm"

# Clang compilation flags for WebAssembly with SIMD & optimizations
CLANG_FLAGS="--target=wasm32 \
  -nostdlib \
  -O3 \
  -flto \
  -fvisibility=hidden \
  -msimd128 \
  -malign-double"

# Source files
SRCS="game.c scenes.c"

# Compile and link directly into WebAssembly
clang $CLANG_FLAGS -Wl,--no-entry -Wl,--export-all -Wl,--allow-undefined -o $OUTFILE $SRCS

echo "✅ WebAssembly Build Completed: $OUTFILE"

