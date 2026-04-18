"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

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
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  animationId: number;
}

export default function Design3D({ design }: Design3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
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

          const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
          camera.position.set(250, 200, 300);
          camera.lookAt(0, 0, 0);

          const renderer = new WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.shadowMap.enabled = true;
          container.appendChild(renderer.domElement);

          const scale = 0.8;
          const scaledWidth = design.width * scale;
          const scaledHeight = design.height * scale;
          const scaledDepth = design.depth * scale;

          const geometry = new BoxGeometry(scaledWidth, scaledHeight, scaledDepth);
          const material = new MeshPhongMaterial({
            color: 0xd0d0d0,
            shininess: 20,
            wireframe: false,
          });

          const mesh = new Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);

          const edges = new EdgesGeometry(geometry);
          const linesMaterial = new LineBasicMaterial({
            color: 0x333333,
            linewidth: 2,
            transparent: true,
            opacity: 0.7,
          });
          const wireframe = new LineSegments(edges, linesMaterial);
          mesh.add(wireframe);

          const ambientLight = new AmbientLight(0xffffff, 0.7);
          scene.add(ambientLight);

          const directionalLight = new DirectionalLight(0xffffff, 0.6);
          directionalLight.position.set(200, 200, 200);
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 2048;
          directionalLight.shadow.mapSize.height = 2048;
          directionalLight.shadow.camera.far = 1000;
          directionalLight.shadow.camera.left = -500;
          directionalLight.shadow.camera.right = 500;
          directionalLight.shadow.camera.top = 500;
          directionalLight.shadow.camera.bottom = -500;
          scene.add(directionalLight);

          const fillLight = new DirectionalLight(0xffffff, 0.2);
          fillLight.position.set(-200, 100, -200);
          scene.add(fillLight);

          const animate = () => {
            animationId = requestAnimationFrame(animate);
            mesh.rotation.x += 0.0015;
            mesh.rotation.y += 0.002;
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
          };

          window.addEventListener("resize", handleResize);
          sceneRef.current = { mesh, renderer, scene, camera, animationId };
          setIsLoaded(true);

          if (disposed) {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            edges.dispose();
            material.dispose();
            linesMaterial.dispose();
          }
        } catch (error) {
          console.error("Error al crear visualizaciÃ³n 3D:", error);
          setIsLoaded(false);
        }
      }
    );

    return () => {
      disposed = true;
      setIsLoaded(false);

      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
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
        <div className="w-full h-96 rounded border border-border bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-sm text-slate-500">
          Cargando visualizaciÃ³n 3D...
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-96 rounded border border-border bg-gray-50"
        style={{ minHeight: "400px", display: isLoaded ? "block" : "none" }}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-xs">
        <div>
          <p className="text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Ancho
          </p>
          <p className="text-lg font-light text-foreground">
            {design.width} cm
          </p>
        </div>
        <div>
          <p className="text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Alto
          </p>
          <p className="text-lg font-light text-foreground">
            {design.height} cm
          </p>
        </div>
        <div>
          <p className="text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Profundidad
          </p>
          <p className="text-lg font-light text-foreground">
            {design.depth} cm
          </p>
        </div>
        <div>
          <p className="text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Material
          </p>
          <p className="text-lg font-light text-foreground capitalize">
            {design.material}
          </p>
        </div>
      </div>
    </div>
  );
}
