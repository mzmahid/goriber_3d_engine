const vs = [
    {x:  0.25, y:  0.25, z:  0.25},
    {x: -0.25, y:  0.25, z:  0.25},
    {x: -0.25, y: -0.25, z:  0.25},
    {x:  0.25, y: -0.25, z:  0.25},

    {x:  0.25, y:  0.25, z: -0.25},
    {x: -0.25, y:  0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
    {x:  0.25, y: -0.25, z: -0.25},
]

const fs = [
    // Front face (vertices 0, 1, 2, 3)
    [0, 1, 2], [0, 2, 3], // Front (2 triangles)

    // Back face (vertices 4, 5, 6, 7)
    [6, 5, 4], [7, 6, 4], // Back (2 triangles)

    // // // Top face (vertices 0, 1, 5, 4)
    [5, 1, 0], [4, 5, 0], // Top (2 triangles)

    // // // Bottom face (vertices 3, 2, 6, 7)
    [3, 2, 6], [3, 6, 7], // Bottom (2 triangles)

    // // // Left face (vertices 1, 2, 6, 5)
    [6, 2, 1], [5, 6, 1], // Left (2 triangles)

    // // // Right face (vertices 0, 3, 7, 4)
    [0, 3, 7], [0, 7, 4], // Right (2 triangles)
];