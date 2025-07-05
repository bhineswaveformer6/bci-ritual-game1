
/**
 * 3D Model Loader for various formats
 * Supports GLTF, GLB, OBJ, FBX with proper error handling
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export interface Model3DInfo {
  object: THREE.Object3D;
  animations?: THREE.AnimationClip[];
  vertexCount: number;
  triangleCount: number;
  boundingBox: THREE.Box3;
  hasAnimations: boolean;
  hasMaterials: boolean;
}

export class ThreeModelLoader {
  private gltfLoader: GLTFLoader;
  private objLoader: OBJLoader;
  private fbxLoader: FBXLoader;
  private loadingManager: THREE.LoadingManager;

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.objLoader = new OBJLoader(this.loadingManager);
    this.fbxLoader = new FBXLoader(this.loadingManager);
  }

  private calculateModelInfo(object: THREE.Object3D, animations?: THREE.AnimationClip[]): Model3DInfo {
    let vertexCount = 0;
    let triangleCount = 0;
    let hasMaterials = false;

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          const geometry = child.geometry;
          if (geometry.attributes.position) {
            vertexCount += geometry.attributes.position.count;
          }
          if (geometry.index) {
            triangleCount += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            triangleCount += geometry.attributes.position.count / 3;
          }
        }
        if (child.material) {
          hasMaterials = true;
        }
      }
    });

    const boundingBox = new THREE.Box3().setFromObject(object);
    
    return {
      object,
      animations: animations || [],
      vertexCount: Math.floor(vertexCount),
      triangleCount: Math.floor(triangleCount),
      boundingBox,
      hasAnimations: (animations && animations.length > 0) || false,
      hasMaterials
    };
  }

  async loadGLTF(url: string): Promise<Model3DInfo> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          try {
            const info = this.calculateModelInfo(gltf.scene, gltf.animations);
            resolve(info);
          } catch (error) {
            reject(new Error(`Failed to process GLTF model: ${error}`));
          }
        },
        (progress) => {
          // Progress callback if needed
        },
        (error) => {
          reject(new Error(`Failed to load GLTF model: ${error}`));
        }
      );
    });
  }

  async loadOBJ(url: string): Promise<Model3DInfo> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        url,
        (object) => {
          try {
            const info = this.calculateModelInfo(object);
            resolve(info);
          } catch (error) {
            reject(new Error(`Failed to process OBJ model: ${error}`));
          }
        },
        (progress) => {
          // Progress callback if needed
        },
        (error) => {
          reject(new Error(`Failed to load OBJ model: ${error}`));
        }
      );
    });
  }

  async loadFBX(url: string): Promise<Model3DInfo> {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        url,
        (object) => {
          try {
            const animations = object.animations || [];
            const info = this.calculateModelInfo(object, animations);
            resolve(info);
          } catch (error) {
            reject(new Error(`Failed to process FBX model: ${error}`));
          }
        },
        (progress) => {
          // Progress callback if needed
        },
        (error) => {
          reject(new Error(`Failed to load FBX model: ${error}`));
        }
      );
    });
  }

  async loadModel(url: string, fileType?: string): Promise<Model3DInfo> {
    const extension = fileType || url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'gltf':
      case 'glb':
        return this.loadGLTF(url);
      case 'obj':
        return this.loadOBJ(url);
      case 'fbx':
        return this.loadFBX(url);
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  // Create basic geometric shapes for presets
  createPresetModel(type: 'cube' | 'sphere' | 'torus' | 'octahedron' | 'icosahedron'): Model3DInfo {
    let geometry: THREE.BufferGeometry;
    
    switch (type) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1, 0);
        break;
      case 'cube':
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
    }

    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00ffff,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0x001122
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    const info = this.calculateModelInfo(mesh);
    
    return info;
  }
}

export const modelLoader = new ThreeModelLoader();
