"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Design3D({ design }: Design3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    Promise.resolve().then(() => {
      import("three").then(
        ({ Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight, AmbientLight, LineSegments, LineBasicMaterial, EdgesGeometry }) => {
          const container = containerRef.current;
          if (!container) return;

          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

          try {
            const scene = new Scene();
            (scene.background as any) = { r: 0.98, g: 0.98, b: 0.98 };

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

            // Escalar dimensiones
            const scale = 0.8;
            const w = design.width * scale;
            const h = design.height * scale;
            const d = design.depth * scale;

            // Crear geometría
            const geometry = new BoxGeometry(w, h, d);

            // Material: Gris claro minimalista
            const materialColor = 0xd0d0d0;
            const material = new MeshPhongMaterial({
              color: materialColor,
              shininess: 20,
              wireframe: false,
            });

            const mesh = new Mesh(geometry, material);
            (mesh as any).castShadow = true;
            (mesh as any).receiveShadow = true;
            scene.add(mesh);

            // BORDES/ARISTAS - Estilo técnico minimalista
            const edges = new EdgesGeometry(geometry);
            const linesMaterial = new LineBasicMaterial({
              color: 0x333333,
              linewidth: 2,
              transparent: true,
              opacity: 0.7,
            });
            const wireframe = new LineSegments(edges, linesMaterial);
            mesh.add(wireframe);

            // Iluminación suave + técnica
            const ambientLight = new AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const directionalLight = new DirectionalLight(0xffffff, 0.6);
            directionalLight.position.set(200, 200, 200);
            directionalLight.castShadow = true;
            (directionalLight as any).shadow.mapSize.width = 2048;
            (directionalLight as any).shadow.mapSize.height = 2048;
            (directionalLight as any).shadow.camera.far = 1000;
            (directionalLight as any).shadow.camera.left = -500;
            (directionalLight as any).shadow.camera.right = 500;
            (directionalLight as any).shadow.camera.top = 500;
            (directionalLight as any).shadow.camera.bottom = -500;
            scene.add(directionalLight);

            // Luz de relleno suave
            const fillLight = new DirectionalLight(0xffffff, 0.2);
            fillLight.position.set(-200, 100, -200);
            scene.add(fillLight);

            // Rotación automática controlada
            let animationId: number;
            let rotationX = 0.3;
            let rotationY = 0.5;

            const animate = () => {
              animationId = requestAnimationFrame(animate);
              
              // Rotación suave
              mesh.rotation.x += 0.0015;
              mesh.rotation.y += 0.002;
              
              renderer.render(scene, camera);
            };
            animate();

            // Manejo de resize
            const handleResize = () => {
              if (!containerRef.current) return;
              const w = containerRef.current.clientWidth;
              const h = containerRef.current.clientHeight;
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
              renderer.setSize(w, h);
            };

            window.addEventListener("resize", handleResize);
            sceneRef.current = { mesh, renderer, scene, camera, animationId };
            setIsLoaded(true);

            return () => {
              window.removeEventListener("resize", handleResize);
              cancelAnimationFrame(animationId);
              renderer.dispose();
              (geometry as any).dispose();
              material.dispose();
              linesMaterial.dispose();
            };
          } catch (error) {
            console.error("Error al crear visualización 3D:", error);
            setIsLoaded(false);
          }
        }
      );
    });
  }, [design]);

  return (
    <div className="w-full space-y-4">
      {!isLoaded && (
        <div className="w-full h-96 rounded border border-border bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-sm text-slate-500">
          Cargando visualización 3D...
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
