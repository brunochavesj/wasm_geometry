import trimesh
import numpy as np
import sys

if len(sys.argv) < 2:
    print("Usage: python stl_to_inc.py tunnel.stl")
    sys.exit(1)

filename = sys.argv[1]

# Load the STL
mesh = trimesh.load(filename)

# Get vertices and faces (indices)
vertices = np.array(mesh.vertices, dtype=np.float32)
faces = np.array(mesh.faces, dtype=np.uint32)

# Write C arrays
with open("tunnel_vertices.inc", "w") as f:
    f.write("// Vertices (x, y, z)\n")
    f.write(f"float tunnel_vertices[{len(vertices)*3}] = {{\n")
    for v in vertices:
        f.write(f"    {v[0]:.6f}f, {v[1]:.6f}f, {v[2]:.6f}f,\n")
    f.write("};\n")

with open("tunnel_indices.inc", "w") as f:
    f.write("// Triangle indices\n")
    f.write(f"unsigned int tunnel_indices[{len(faces)*3}] = {{\n")
    for tri in faces:
        f.write(f"    {tri[0]}, {tri[1]}, {tri[2]},\n")
    f.write("};\n")

print(f"Exported {len(vertices)} vertices and {len(faces)} faces")

