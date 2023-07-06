import React, { useCallback, useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";

const MOVE_SPEED = 5;
const HOVER_COLOR = new BABYLON.Color4(12 / 255, 242 / 255, 93 / 255, 1);

function getShared(indices, positions) {
  const shared = Array.from({ length: indices.length }, () => []);

  for (let i = 0; i < indices.length; i++) {
    for (let j = 0; j < indices.length; j++) {
      if (
        positions[3 * indices[i] + 0] === positions[3 * indices[j] + 0] &&
        positions[3 * indices[i] + 1] === positions[3 * indices[j] + 1] &&
        positions[3 * indices[i] + 2] === positions[3 * indices[j] + 2]
      ) {
        shared[indices[i]].push(indices[j]);
      }
    }
    // if (shared[i].length < 6) console.log(i);
  }
  // console.log(shared);
  return shared;
}

const BabylonScene = () => {
  const sceneRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [hitInfo, setHitInfo] = useState(null);

  const draggingRef = useRef();
  const hitInfoRef = useRef();

  draggingRef.current = dragging;
  hitInfoRef.current = hitInfo;

  useEffect(() => {
    const canvas = sceneRef.current;

    // Create the Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create a scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(3 / 255, 65 / 255, 89 / 255, 1);

    const box = BABYLON.MeshBuilder.CreateBox(
      "box",
      { size: 1, updatable: true },
      scene
    );

    box.convertToFlatShadedMesh();

    box.position = new BABYLON.Vector3(0, 0, 0);

    let positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    let colors = box.getVerticesData(BABYLON.VertexBuffer.ColorKind);

    if (!colors)
      colors = Array.from({ length: (positions.length / 3) * 4 }, () => 1);

    const indices = box.getIndices();
    const shared = getShared(indices, positions);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      0,
      10,
      box.position,
      scene
    );

    camera.setPosition(new BABYLON.Vector3(0, 0, 5));
    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);

    window.addEventListener("resize", function () {
      engine.resize();
    });
    // Run the render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    scene.onPointerDown = () => {
      const hit = scene.pick(scene.pointerX, scene.pointerY);

      if (hit.pickedMesh) {
        setDragging(true);

        const face = hit.faceId / 2;
        const facet = 2 * Math.floor(face);
        const normal = hit.getNormal();

        setHitInfo({
          face,
          facet,
          normal,
          position: {
            x: scene.pointerX,
            y: scene.pointerY,
          },
        });
      }
    };

    const unproject = ({ x, y }) =>
      BABYLON.Vector3.Unproject(
        new BABYLON.Vector3(x, y, 0),
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        BABYLON.Matrix.Identity(),
        scene.getViewMatrix(),
        scene.getProjectionMatrix()
      );

    scene.onPointerMove = () => {
      if (draggingRef.current && hitInfoRef.current) {
        camera.detachControl();

        const { facet, normal, position } = hitInfoRef.current;

        const offset = unproject({
          x: scene.pointerX,
          y: scene.pointerY,
        }).subtract(unproject(position));

        const vertices = Array.from(
          new Set(
            indices.slice(3 * facet, 3 * facet + 6).reduce((acc, cur) => {
              acc.push(cur);
              acc.push(...shared[cur]);
              return acc;
            }, [])
          )
        );

        vertices.forEach((vertex) => {
          for (let j = 0; j < 3; j++) {
            positions[3 * vertex + j] +=
              MOVE_SPEED *
              BABYLON.Vector3.Dot(offset, normal) *
              normal.asArray()[j];
          }
        });

        box.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);

        setHitInfo({
          ...hitInfoRef.current,
          position: {
            x: scene.pointerX,
            y: scene.pointerY,
          },
        });
      } else {
        colors = Array.from({ length: (positions.length / 3) * 4 }, () => 1);
        box.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);

        const hit = scene.pick(scene.pointerX, scene.pointerY);

        if (hit.pickedMesh) {
          const face = hit.faceId / 2;
          const facet = 2 * Math.floor(face);

          for (var i = 0; i < 6; i++) {
            const vertex = indices[3 * facet + i];

            colors[4 * vertex] = HOVER_COLOR.r;
            colors[4 * vertex + 1] = HOVER_COLOR.g;
            colors[4 * vertex + 2] = HOVER_COLOR.b;
            colors[4 * vertex + 3] = HOVER_COLOR.a;
          }

          box.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        }
      }
    };

    scene.onPointerUp = () => {
      camera.attachControl(canvas, true);

      setDragging(false);
      setHitInfo(null);
    };

    // Clean up on component unmount
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default BabylonScene;
