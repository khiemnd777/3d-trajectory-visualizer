# 3D Trajectory Visualization

This project demonstrates a 3D visualization of wellbore trajectories using Three.js. It utilizes advanced rendering techniques and interactive controls to display geological survey data in a comprehensive and intuitive manner.

## Features

- **3D Line Rendering**: Visualize wellbore paths using `Line2`, `LineGeometry`, and `LineMaterial` from Three.js.
- **Interactive Controls**: Rotate, zoom, and pan the camera using `OrbitControls`.
- **Labels and Markers**: Display labels and markers at specific points along the wellbore path using `CSS2DRenderer`.
- **Axes and Ground Plane**: Include axes for orientation and a ground plane for better spatial understanding.

![image](https://github.com/khiemnd777/3d-trajectory-visualizer/assets/488071/fb697f6b-e2c4-4f00-9ca1-288f60fd1f95)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/khiemnd777/3d-trajectory-visualizer.git
   ```
2. To install dependencies:

   ```bash
   bun install
   ```
3. To run:

   ```bash
   bun run server.ts
   ```
This project was created using `bun init` in bun v1.1.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

4. Open `http://localhost:3000` in a web browser to view the visualization.

## Usage

- **Rotate**: Click and drag to rotate the scene.
- **Zoom**: Scroll to zoom in and out.
- **Pan**: Right-click and drag to pan the scene.

## Project Structure

```
/project-root
  ├── src
  │   ├── main.js          // Main entry point
  │   ├── threejs-setup.js // Three.js setup and utility functions
  │   ├── calculations.js  // Wellbore trajectory calculations
  ├── index.html           // HTML file with import map
  ├── styles.css           // Optional CSS for styling
  └── README.md            // Project documentation
```

## Dependencies

- [Three.js](https://threejs.org/)
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [CSS2DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the BSD 2-Clause License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Three.js documentation and examples for providing comprehensive resources and inspiration.
