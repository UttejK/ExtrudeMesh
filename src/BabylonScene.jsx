import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import { BoundingBoxGizmo } from "./MakeExtrusion";

const BabylonScene = () => {
  const sceneRef = useRef(null);
  const [off, setOff] = useState(true);

  useEffect(() => {
    const canvas = sceneRef.current;

    // Create the Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create a scene
    const scene = new BABYLON.Scene(engine);

    const box = BABYLON.MeshBuilder.CreateBox(
      "box",
      { size: 1, updatable: true },
      scene
    );
    box.convertToFlatShadedMesh();
    box.updateFacetData();
    // console.log(box.facetNb);
    // console.log(box.isFacetDataEnabled);
    box.position = new BABYLON.Vector3(0, 0, 0);
    // console.log(box.getVerticesData("position"));
    // You Dont need all the 72 vertices, you only need the first 24

    var positions = box.getFacetLocalPositions();
    var normals = box.getFacetLocalNormals();
    var lines = [];
    for (var i = 0; i < positions.length; i++) {
      var line = [positions[i], positions[i].add(normals[i])];
      lines.push(line);
    }
    // var lineSystem = BABYLON.MeshBuilder.CreateLineSystem(
    //   "ls",
    //   { lines: lines },
    //   scene
    // );
    // lineSystem.color = BABYLON.Color3.Green();

    // Create a camera
    // const camera = new BABYLON.FreeCamera(
    //   "camera",
    //   new BABYLON.Vector3(0, 0, 10),
    //   scene
    // );

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      box.position,
      scene
    );

    camera.setPosition(new BABYLON.Vector3(0, 0, 5));

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Create a light
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );

    // box.scaleFromPivot = function (pivotPoint, sx, sy, sz) {
    //   var _sx = sx / this.scaling.x;
    //   var _sy = sy / this.scaling.y;
    //   var _sz = sz / this.scaling.z;
    //   this.scaling = new BABYLON.Vector3(sx, sy, sz);
    //   this.position = new BABYLON.Vector3(
    //     pivotPoint.x + _sx * (this.position.x - pivotPoint.x),
    //     pivotPoint.y + _sy * (this.position.y - pivotPoint.y),
    //     pivotPoint.z + _sz * (this.position.z - pivotPoint.z)
    //   );
    // };
    // box.scaleFromPivot(new BABYLON.Vector3(1, 0, 0), 2, 1, 1);

    // onclick
    scene.onPointerDown = () => {
      const hit = scene.pick(scene.pointerX, scene.pointerY);
      const poshit = hit.pickedMesh?.getVerticesData("position");
      // const test = new BABYLON.Vector3(-1, -1, -1);
      console.log(hit.pickedMesh?.getFacetPosition(hit.faceId));
      for (let i = 0; i < poshit?.length; i += 3) {
        const vertex = new BABYLON.Vector3(
          poshit[i],
          poshit[i + 1],
          poshit[i + 2]
        );

        // console.log(vertex.x, vertex.y, vertex.z);
        // console.log(
        // hit.getNormal(),
        // vertex,
        if (BABYLON.Vector3.Dot(hit.getNormal(), vertex) === 0) {
          console.log(1);
        }
        // );
      }
      const vertex = poshit?.slice();
      for (let i = 0; i < poshit?.length; i += 3) {
        // vertex[0] += 0.1;
        // vertex[10] += 0.1;
        // vertex[20] += 0.1;
        // console.log(vertex);
      }
      // console.log(vertex);
      try {
        hit.pickedMesh?.setVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          vertex
        );
        hit.pickedMesh?._generatePointsArray(true);
        // console.log(
        //   // hit.pickedMesh?.getVerticesData(BABYLON.VertexBuffer.PositionKind)
        //   hit.pickedMesh?._geometry._positions

        //   // hit.pickedMesh?.getIndices()
        // );
      } catch (err) {
        console.error(err);
      }
      setOff(false);
    };
    scene.onPointerMove = () => {
      if (!off) {
      }
    };
    scene.onPointerUp = () => {
      setOff(true);
    };

    const enablegizmo = false;
    if (enablegizmo) {
      const boundingBoxGizmo = new BoundingBoxGizmo();
      boundingBoxGizmo.setColor(new BABYLON.Color3(0, 0.7, 1));
      boundingBoxGizmo.attachedMesh = box;
      boundingBoxGizmo.enableDragBehavior();
      box.getClosestFacetAtCoordinates;
    }

    const axes = new BABYLON.AxesViewer(scene, 0.5);

    window.addEventListener("resize", function () {
      engine.resize();
    });
    // Run the render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Clean up on component unmount
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default BabylonScene;
