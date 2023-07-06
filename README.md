# Extrude Mesh

This project aims to recreate the functionality of extruding a mesh, commonly found in digital content creation tools such as Blender, Maya, and Unreal Engine. The project provides a simple scene where you can interact with a cube at the center.

## Demo

To try out the project, you have two options:

1. Visit the following site: [https://uttejk-extrudemesh.netlify.app/](https://uttejk-extrudemesh.netlify.app/)

2. Clone the repository and run the following commands:

   - `npm install`
   - `npm run dev`

   After the installation is complete, open your browser and navigate to [http://localhost:3000/](http://localhost:3000/) to load the site.

## Instructions

1. **Extruding the Mesh**

   - To perform an extrusion, click on one of the faces of the cube. This action will select the face for extrusion.
   - Once the face is selected, move your cursor. You will notice that the selected face moves in the direction of its normal vector.
   - To complete the extrusion, click again (release the click after the first click).

   Note: The extrusion functionality simulates a push-pull mechanism similar to SketchUp. It allows you to interactively modify the shape of the cube by extruding individual faces.

2. **Orbiting the Scene**

   - Until the extrusion is confirmed or completed, you cannot orbit around the scene. This restriction ensures accurate interaction during the extrusion process.

3. **Resetting the Mesh**

   - A reset button is located in the top-right corner of the scene. Clicking the reset button will revert the dimensions of the cube, undoing any changes made to it.

4. **Showing Mesh Edges**

   - You have the option to show the edges of the mesh by uncommenting the relevant part of the code. Look for the comment indicating the section to uncomment.
   - By enabling the display of mesh edges, you can visualize the wireframe structure of the cube.

5. **Enabling Drag Behavior**

   - To enable drag behavior for the mesh:
     - Uncomment the part in the code that says `scene.onPointerUp()` and the code within that function.
     - Remove the counter being set in the `scene.onPointerDown()` function.

   Note: The drag behavior allows you to interactively drag the mesh instead of using the click-and-move method described earlier. Ensure the changes are made correctly for the drag behavior to work.

Feel free to explore the code and experiment with the mesh extrusion functionality in the Babylon.js scene!

For more details and to access the source code, visit the [GitHub repository](https://github.com/<your-github-username>/<your-repository-name>).
