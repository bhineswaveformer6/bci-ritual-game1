

/**
 * BCI Brain Wave Simulation Engine
 * Generates realistic EEG signals for different mental states
 */

export interface EEGData {
  deltaWave: number;      // 0.5-4 Hz
  thetaWave: number;      // 4-8 Hz  
  alphaWave: number;      // 8-13 Hz
  betaWave: number;       // 13-30 Hz
  gammaWave: number;      // 30-100 Hz
  timestamp: number;
}

export interface BrainMetrics {
  eegData: EEGData;
  alphaTheta: number;           // Alpha/Theta ratio for relaxation
  betaGammaAlpha: number;       // (Beta+Gamma)/Alpha for focus
  coherence: number;            // Brain region synchrony (0-1)
  energeticSignature: number;   // Combined metric (0-100)
  focusScore: number;           // 0-100
  calmScore: number;            // 0-100
  meditationDepth: number;      // 0-100
}

export enum TargetState {
  DEEP_MEDITATION = 'DEEP_MEDITATION',
  RELAXATION = 'RELAXATION', 
  FOCUS = 'FOCUS',
  FLOW_STATE = 'FLOW_STATE',
  NEUTRAL = 'NEUTRAL'
}

export class BCISimulator {
  private currentState: TargetState = TargetState.NEUTRAL;
  private transitionSpeed: number = 1.0;
  private noiseLevel: number = 0.1;
  private amplitudeScale: number = 1.0;
  private time: number = 0;
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private callbacks: ((metrics: BrainMetrics) => void)[] = [];

  constructor(options?: {
    transitionSpeed?: number;
    noiseLevel?: number;
    amplitudeScale?: number;
  }) {
    if (options) {
      this.transitionSpeed = options.transitionSpeed ?? 1.0;
      this.noiseLevel = options.noiseLevel ?? 0.1;
      this.amplitudeScale = options.amplitudeScale ?? 1.0;
    }
  }

  private generateBaseWaves(): EEGData {
    const t = this.time * 0.01; // Time scaling
    const noise = () => (Math.random() - 0.5) * this.noiseLevel;

    // Base wave patterns with realistic frequency characteristics
    const baseWaves = {
      deltaWave: Math.sin(t * 0.5) * 0.8 + noise(),
      thetaWave: Math.sin(t * 1.2) * 0.7 + noise(),
      alphaWave: Math.sin(t * 2.5) * 0.9 + noise(),
      betaWave: Math.sin(t * 4.0) * 0.6 + noise(),
      gammaWave: Math.sin(t * 8.0) * 0.4 + noise(),
      timestamp: Date.now()
    };

    return baseWaves;
  }

  private applyStateModification(baseWaves: EEGData): EEGData {
    const modified = { ...baseWaves };
    
    switch (this.currentState) {
      case TargetState.DEEP_MEDITATION:
        // High Theta, moderate Alpha, low Beta
        modified.thetaWave *= 2.5;
        modified.alphaWave *= 1.5;
        modified.betaWave *= 0.3;
        modified.deltaWave *= 1.2;
        modified.gammaWave *= 0.5;
        break;
        
      case TargetState.RELAXATION:
        // High Alpha, low Beta, moderate Theta
        modified.alphaWave *= 2.2;
        modified.thetaWave *= 1.3;
        modified.betaWave *= 0.4;
        modified.deltaWave *= 0.8;
        modified.gammaWave *= 0.6;
        break;
        
      case TargetState.FOCUS:
        // High Beta, moderate Gamma, lower Alpha
        modified.betaWave *= 2.0;
        modified.gammaWave *= 1.5;
        modified.alphaWave *= 0.7;
        modified.thetaWave *= 0.6;
        modified.deltaWave *= 0.5;
        break;
        
      case TargetState.FLOW_STATE:
        // Balanced Beta-Gamma with high coherence
        modified.betaWave *= 1.8;
        modified.gammaWave *= 1.7;
        modified.alphaWave *= 1.2;
        modified.thetaWave *= 0.8;
        modified.deltaWave *= 0.6;
        break;
        
      case TargetState.NEUTRAL:
      default:
        // Balanced baseline state
        break;
    }

    // Apply amplitude scaling
    Object.keys(modified).forEach(key => {
      if (key !== 'timestamp') {
        (modified as any)[key] *= this.amplitudeScale;
      }
    });

    return modified;
  }

  private calculateMetrics(eegData: EEGData): BrainMetrics {
    const { deltaWave, thetaWave, alphaWave, betaWave, gammaWave } = eegData;
    
    // Ensure positive values for ratios
    const safeAlpha = Math.max(Math.abs(alphaWave), 0.001);
    const safeTheta = Math.max(Math.abs(thetaWave), 0.001);
    const safeBeta = Math.max(Math.abs(betaWave), 0.001);
    const safeGamma = Math.max(Math.abs(gammaWave), 0.001);

    // Calculate key ratios
    const alphaTheta = safeAlpha / safeTheta;
    const betaGammaAlpha = (safeBeta + safeGamma) / safeAlpha;
    
    // Coherence simulation (varies with state)
    let coherence = 0.5;
    switch (this.currentState) {
      case TargetState.FLOW_STATE:
        coherence = 0.8 + Math.sin(this.time * 0.005) * 0.15;
        break;
      case TargetState.DEEP_MEDITATION:
        coherence = 0.7 + Math.sin(this.time * 0.003) * 0.2;
        break;
      case TargetState.FOCUS:
        coherence = 0.6 + Math.sin(this.time * 0.007) * 0.15;
        break;
      default:
        coherence = 0.5 + Math.sin(this.time * 0.004) * 0.1;
    }
    coherence = Math.max(0, Math.min(1, coherence));

    // Calculate derived scores (0-100)
    const focusScore = Math.min(100, Math.max(0, 
      (betaGammaAlpha * 20) + (coherence * 30) + (safeBeta * 25)
    ));
    
    const calmScore = Math.min(100, Math.max(0,
      (alphaTheta * 25) + (safeAlpha * 35) + ((1 - safeBeta) * 40)
    ));
    
    const meditationDepth = Math.min(100, Math.max(0,
      (safeTheta * 40) + (safeAlpha * 30) + (coherence * 30)
    ));

    // Energetic Signature: composite score
    const energeticSignature = Math.min(100, Math.max(0,
      (focusScore * 0.3) + (calmScore * 0.3) + (meditationDepth * 0.25) + (coherence * 25)
    ));

    return {
      eegData,
      alphaTheta,
      betaGammaAlpha,
      coherence,
      energeticSignature,
      focusScore,
      calmScore,
      meditationDepth
    };
  }

  public start(updateRate: number = 100): void {
    if (this.isRunning) return;
    
    // Browser environment check for SSR compatibility
    if (typeof window === 'undefined') {
      console.warn('BCI Simulator: Cannot start in server environment');
      return;
    }
    
    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.time += 1;
      const baseWaves = this.generateBaseWaves();
      const modifiedWaves = this.applyStateModification(baseWaves);
      const metrics = this.calculateMetrics(modifiedWaves);
      
      this.callbacks.forEach(callback => {
        try {
          callback(metrics);
        } catch (error) {
          console.error('BCI Simulator: Error in callback:', error);
        }
      });
    }, updateRate);
  }

  public stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setState(state: TargetState): void {
    this.currentState = state;
  }

  public getState(): TargetState {
    return this.currentState;
  }

  public setParameters(params: {
    transitionSpeed?: number;
    noiseLevel?: number;
    amplitudeScale?: number;
  }): void {
    if (params.transitionSpeed !== undefined) this.transitionSpeed = params.transitionSpeed;
    if (params.noiseLevel !== undefined) this.noiseLevel = params.noiseLevel;
    if (params.amplitudeScale !== undefined) this.amplitudeScale = params.amplitudeScale;
  }

  public onDataUpdate(callback: (metrics: BrainMetrics) => void): void {
    this.callbacks.push(callback);
  }

  public removeCallback(callback: (metrics: BrainMetrics) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }
}

// Helper function for safe BCI simulation start
export const startBCISimulation = (callback: (metrics: BrainMetrics) => void) => {
  if (typeof window !== 'undefined') {
    const intervalId = window.setInterval(() => {
      const simulator = new BCISimulator();
      const baseWaves = {
        deltaWave: Math.random() * 0.8,
        thetaWave: Math.random() * 0.7,
        alphaWave: Math.random() * 0.9,
        betaWave: Math.random() * 0.6,
        gammaWave: Math.random() * 0.4,
        timestamp: Date.now()
      };
      
      const metrics = {
        eegData: baseWaves,
        alphaTheta: Math.random() * 2,
        betaGammaAlpha: Math.random() * 3,
        coherence: Math.random(),
        energeticSignature: Math.random() * 100,
        focusScore: Math.random() * 100,
        calmScore: Math.random() * 100,
        meditationDepth: Math.random() * 100,
      };
      
      callback(metrics);
    }, 1000);
    
    return () => window.clearInterval(intervalId);
  }
  return () => {}; // Return an empty function if not in browser
};

// Default instance with browser safety
export const bciSimulator = new BCISimulator();
