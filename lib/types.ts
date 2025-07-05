
// Extend the existing types.ts with BCI-specific types

export interface BrainWaveSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  peakEnergeticScore: number;
  averageEnergeticScore: number;
  targetState: string;
  status: 'ACTIVE' | 'COMPLETED' | 'INTERRUPTED' | 'ERROR';
  modelUsed?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Model3DInfo {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  fileType: 'GLTF' | 'GLB' | 'OBJ' | 'FBX';
  uploadDate: Date;
  isPreset: boolean;
  thumbnailUrl?: string;
  description?: string;
  vertexCount?: number;
  triangleCount?: number;
  hasAnimations: boolean;
  hasMaterials: boolean;
  boundingBoxSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrainMetricData {
  id: string;
  sessionId: string;
  timestamp: Date;
  deltaWave: number;
  thetaWave: number;
  alphaWave: number;
  betaWave: number;
  gammaWave: number;
  alphaTheta: number;
  betaGammaAlpha: number;
  coherence: number;
  energeticSignature: number;
  focusScore: number;
  calmScore: number;
  meditationDepth: number;
}

export interface UserPreferences {
  id: string;
  dataSource: 'LIVE_BCI' | 'SIMULATOR';
  simulatorState: string;
  preferredModelId?: string;
  dashboardLayout: string;
  chartUpdateRate: number;
  cameraPosition: string;
  autoRotate: boolean;
  ambientLightIntensity: number;
  waveAmplitudeScale: number;
  noiseLevel: number;
  transitionSpeed: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SessionStats {
  totalSessions: number;
  averageDuration: number;
  bestEnergeticScore: number;
  favoriteTargetState: string;
  totalTimeSpent: number;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface BrainWaveChartData {
  timestamp: number;
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
}

// 3D Model interaction types
export interface ModelReactionConfig {
  colorIntensity: number;
  scaleMultiplier: number;
  rotationSpeed: number;
  emissiveStrength: number;
  particleCount: number;
}

// File upload types
export interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    vertexCount: number;
    triangleCount: number;
    fileSize: number;
    hasAnimations: boolean;
    hasMaterials: boolean;
  };
}
