import * as THREE from "three";

export function isSafariBrowser() {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function getCanvasDpr() {
  return isSafariBrowser() ? ([1, 1] as [number, number]) : ([1, 1.5] as [number, number]);
}

export function getMaxPixelRatio() {
  const target = isSafariBrowser() ? 1 : 1.5;
  return typeof window === "undefined" ? target : Math.min(window.devicePixelRatio || 1, target);
}

export function disposeMaterial(material: THREE.Material) {
  const typedMaterial = material as THREE.Material & {
    [key: string]: unknown;
    map?: THREE.Texture | null;
    alphaMap?: THREE.Texture | null;
    aoMap?: THREE.Texture | null;
    bumpMap?: THREE.Texture | null;
    displacementMap?: THREE.Texture | null;
    emissiveMap?: THREE.Texture | null;
    envMap?: THREE.Texture | null;
    lightMap?: THREE.Texture | null;
    metalnessMap?: THREE.Texture | null;
    normalMap?: THREE.Texture | null;
    roughnessMap?: THREE.Texture | null;
  };

  const textureKeys = [
    "map",
    "alphaMap",
    "aoMap",
    "bumpMap",
    "displacementMap",
    "emissiveMap",
    "envMap",
    "lightMap",
    "metalnessMap",
    "normalMap",
    "roughnessMap",
  ] as const;

  textureKeys.forEach((key) => {
    const value = typedMaterial[key];
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });

  material.dispose();
}

export function disposeObjectResources(object: THREE.Object3D) {
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry?.dispose();

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(disposeMaterial);
      return;
    }

    if (mesh.material) {
      disposeMaterial(mesh.material);
    }
  });
}
