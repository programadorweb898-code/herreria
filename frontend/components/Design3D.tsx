"use client";

import { useEffect, useRef, useState } from "react";
import type {
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { getMaxPixelRatio, isSafariBrowser } from "@/components/three/performance";

interface Design3DProps {
  design: {
    width: number;
    height: number;
    depth: number;
    complexity: number;
    material: string;
    description: string;
    price: number;
  };
}

interface SceneState {
  mesh: Mesh;
  wireframe: LineSegments;
  linesMaterial: LineBasicMaterial;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  animationId: number;
}

export default function Design3D({ design }: Design3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const rendererCleanupRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let animationId = 0;
    let handleResize: (() => void) | null = null;
    let disposed = false;

    void import("three").then(
      ({
        AmbientLight,
        BoxGeometry,
        Color,
        DirectionalLight,
        EdgesGeometry,
        LineBasicMaterial,
        LineSegments,
        Mesh,
        MeshPhongMaterial,
        PerspectiveCamera,
        Scene,
        WebGLRenderer,
      }) => {
        const container = containerRef.current;
        if (!container || disposed) return;

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        try {
          const scene = new Scene();
          scene.background = new Color(0xfafafa);

          const width = container.clientWidth || 600;
          const height = container.clientHeight || 400;
          const isSafari = isSafariBrowser();

          const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
          camera.position.set(250, 200, 300);
          camera.lookAt(0, 0, 0);

          const renderer = new WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: isSafari ? "low-power" : "high-performance",
            preserveDrawingBuffer: false,
          });
          renderer.setSize(width, height);
          renderer.setPixelRatio(getMaxPixelRatio());
          container.appendChild(renderer.domElement);

          const handleContextLost = (event: Event) => {
            event.preventDefault();
            cancelAnimationFrame(animationId);
            setIsLoaded(false);
          };

          const handleContextRestored = () => {
            setIsLoaded(true);
          };

          renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
          renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);
          rendererCleanupRef.current = () => {
            renderer.domElement.removeEventListener("webglcontextlost", handleContextLost, false);
            renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored, false);
          };

          const scale = 0.8;
          const scaledWidth = design.width * scale;
          const scaledHeight = design.height * scale;
          const scaledDepth = design.depth * scale;

          const geometry = new BoxGeometry(scaledWidth, scaledHeight, scaledDepth);
          const material = new MeshPhongMaterial({
            color: 0xd0d0d0,
            shininess: 12,
            wireframe: false,
          });

          const mesh = new Mesh(geometry, material);
          scene.add(mesh);

          const edges = new EdgesGeometry(geometry);
          const linesMaterial = new LineBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.7,
          });
          const wireframe = new LineSegments(edges, linesMaterial);
          mesh.add(wireframe);

          scene.add(new AmbientLight(0xffffff, 0.85));

          const keyLight = new DirectionalLight(0xffffff, 0.65);
          keyLight.position.set(200, 200, 200);
          scene.add(keyLight);

          const fillLight = new DirectionalLight(0xffffff, 0.18);
          fillLight.position.set(-180, 80, -150);
          scene.add(fillLight);

          const animate = () => {
            animationId = requestAnimationFrame(animate);
            mesh.rotation.x += 0.0012;
            mesh.rotation.y += 0.0016;
            renderer.render(scene, camera);
          };
          animate();

          handleResize = () => {
            if (!containerRef.current) return;
            const nextWidth = containerRef.current.clientWidth;
            const nextHeight = containerRef.current.clientHeight;
            camera.aspect = nextWidth / nextHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(nextWidth, nextHeight);
            renderer.setPixelRatio(getMaxPixelRatio());
          };

          window.addEventListener("resize", handleResize);
          sceneRef.current = { mesh, wireframe, linesMaterial, renderer, scene, camera, animationId };
          setIsLoaded(true);

          if (disposed) {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
            rendererCleanupRef.current?.();
            renderer.dispose();
            geometry.dispose();
            edges.dispose();
            material.dispose();
            linesMaterial.dispose();
          }
        } catch (error) {
          console.error("Error al crear visualizacion 3D:", error);
          setIsLoaded(false);
        }
      },
    );

    return () => {
      disposed = true;
      setIsLoaded(false);

      rendererCleanupRef.current?.();

      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        sceneRef.current.wireframe.geometry.dispose();
        sceneRef.current.linesMaterial.dispose();
        sceneRef.current.mesh.geometry.dispose();

        if (Array.isArray(sceneRef.current.mesh.material)) {
          for (const material of sceneRef.current.mesh.material) {
            material.dispose();
          }
        } else {
          sceneRef.current.mesh.material.dispose();
        }

        sceneRef.current = null;
      }
    };
  }, [design]);

  return (
    <div className="w-full space-y-4">
      {!isLoaded && (
        <div className="flex h-96 w-full items-center justify-center rounded border border-border bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-500">
          Cargando visualizacion 3D...
        </div>
      )}
      <div
        ref={containerRef}
        className="h-96 w-full rounded border border-border bg-gray-50"
        style={{ minHeight: "400px", display: isLoaded ? "block" : "none" }}
      />
      <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
        <div>
          <p className="mb-1 font-semibold uppercase tracking-wider text-slate-600">Ancho</p>
          <p className="text-lg font-light text-foreground">{design.width} cm</p>
        </div>
        <div>
          <p className="mb-1 font-semibold uppercase tracking-wider text-slate-600">Alto</p>
          <p className="text-lg font-light text-foreground">{design.height} cm</p>
        </div>
        <div>
          <p className="mb-1 font-semibold uppercase tracking-wider text-slate-600">Profundidad</p>
          <p className="text-lg font-light text-foreground">{design.depth} cm</p>
        </div>
        <div>
          <p className="mb-1 font-semibold uppercase tracking-wider text-slate-600">Material</p>
          <p className="text-lg font-light capitalize text-foreground">{design.material}</p>
        </div>
      </div>
    </div>
  );
}
