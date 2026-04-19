import * as THREE from 'three';

export const normalizeObj = (group: THREE.Object3D): THREE.Object3D => {
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      mesh.geometry.translate(-center.x, -center.y, -center.z);
      mesh.geometry.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);
      if (!mesh.geometry.attributes.normal) {
        mesh.geometry.computeVertexNormals();
      }
    }
  });

  return group;
};
