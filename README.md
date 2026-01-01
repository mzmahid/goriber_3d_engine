# 3D Cube Renderer

A simple 3D wireframe cube renderer built from scratch using HTML5 Canvas and vanilla JavaScript.

## Credit

Inspired by and following along with [Tsoding's video tutorial](https://www.youtube.com/watch?v=qjWkNZ0SXfo) on 3D rendering from scratch.

## Features

- Real-time 3D rotation animation
- Perspective projection
- Custom transformation pipeline (rotation → projection → screen space)
- Pure canvas rendering, no external libraries

## How It Works

The renderer implements a basic 3D graphics pipeline:

1. **Rotation** - Rotates vertices around the Y-axis
2. **Projection** - Projects 3D coordinates onto 2D screen using perspective division
3. **Screen Mapping** - Converts normalized coordinates to canvas pixel space
4. **Rendering** - Draws edges between transformed vertices

## Transformation Pipeline
```
3D Vertices → Rotate → Project → Translate to Screen → Draw
```

## Usage

Just open `index.html` in a browser. The cube will automatically start rotating.

## Configuration

- `FPS` - Animation frame rate (default: 60)
- `angle` - Rotation speed
- `vertices` - 8 corner points of the cube
- `edges` - Connections between vertices

## Lessons Learned

- Canvas API
- weak perspective projection
- roation matrix
- world space and screen space
- usage of objects

Worth it. 🔥