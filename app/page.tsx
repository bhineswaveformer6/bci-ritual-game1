
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { bciSimulator, BrainMetrics, TargetState } from '@/lib/bci-simulation';

// Dynamic import of ModelViewer with proper error handling
const ModelViewer = dynamic(() => import('@/components/three-d/model-viewer').then(mod => ({ default: mod.ModelViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-950 rounded-lg">
      <div className="text-cyan-400 animate-pulse">Loading 3D Viewer...</div>
    </div>
  ),
});
import { EnergeticSignatureGauge } from '@/components/dashboard/energetic-signature-gauge';
import { BrainWaveChart } from '@/components/dashboard/brain-wave-chart';
import { MetricsPanel } from '@/components/dashboard/metrics-panel';
import { SessionControls } from '@/components/dashboard/session-controls';
import { ModelUpload } from '@/components/file-upload/model-upload';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Box, Palette, Brain } from 'lucide-react';

interface BrainWaveDataPoint {
  timestamp: number;
  deltaWave: number;
  thetaWave: number;
  alphaWave: number;
  betaWave: number;
  gammaWave: number;
}

const PRESET_MODELS = [
  { id: 'sphere', name: 'Sphere', type: 'sphere' as const },
  { id: 'cube', name: 'Cube', type: 'cube' as const },
  { id: 'torus', name: 'Torus', type: 'torus' as const },
  { id: 'octahedron', name: 'Octahedron', type: 'octahedron' as const },
  { id: 'icosahedron', name: 'Icosahedron', type: 'icosahedron' as const },
];

export default function Dashboard() {
  // Client-side rendering guard for SSR compatibility
  const [isClient, setIsClient] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentTargetState, setCurrentTargetState] = useState<TargetState>(TargetState.NEUTRAL);
  const [brainMetrics, setBrainMetrics] = useState<BrainMetrics>({
    eegData: {
      timestamp: Date.now(),
      deltaWave: 0,
      thetaWave: 0,
      alphaWave: 0,
      betaWave: 0,
      gammaWave: 0,
    },
    alphaTheta: 0,
    betaGammaAlpha: 0,
    coherence: 0,
    energeticSignature: 0,
    focusScore: 0,
    calmScore: 0,
    meditationDepth: 0,
  });
  const [brainWaveHistory, setBrainWaveHistory] = useState<BrainWaveDataPoint[]>([]);
  const [selectedModel, setSelectedModel] = useState(PRESET_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Set client state after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle BCI data updates
  const handleBrainDataUpdate = useCallback((metrics: BrainMetrics) => {
    setBrainMetrics(metrics);
    setBrainWaveHistory(prev => [
      ...prev.slice(-99), // Keep last 99 points
      {
        timestamp: metrics.eegData.timestamp,
        deltaWave: metrics.eegData.deltaWave,
        thetaWave: metrics.eegData.thetaWave,
        alphaWave: metrics.eegData.alphaWave,
        betaWave: metrics.eegData.betaWave,
        gammaWave: metrics.eegData.gammaWave,
      }
    ]);
  }, []);

  // Session controls
  const handleStartSession = useCallback(() => {
    if (!isClient) return;
    
    setIsSessionActive(true);
    setSessionDuration(0);
    setBrainWaveHistory([]);
    bciSimulator.setState(currentTargetState);
    bciSimulator.start(100); // Update every 100ms
  }, [isClient, currentTargetState]);

  const handleStopSession = useCallback(() => {
    setIsSessionActive(false);
    bciSimulator.stop();
    // Here you would save session data to database
  }, []);

  const handleResetSession = useCallback(() => {
    setSessionDuration(0);
    setBrainWaveHistory([]);
    setBrainMetrics({
      eegData: {
        timestamp: Date.now(),
        deltaWave: 0,
        thetaWave: 0,
        alphaWave: 0,
        betaWave: 0,
        gammaWave: 0,
      },
      alphaTheta: 0,
      betaGammaAlpha: 0,
      coherence: 0,
      energeticSignature: 0,
      focusScore: 0,
      calmScore: 0,
      meditationDepth: 0,
    });
  }, []);

  const handleStateChange = useCallback((state: TargetState) => {
    setCurrentTargetState(state);
    if (isSessionActive) {
      bciSimulator.setState(state);
    }
  }, [isSessionActive]);

  const handleModelUpload = async (file: File) => {
    // Simulate file upload - in real app, this would upload to server
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Model uploaded:', file.name);
    // Would add to model list and select it
  };

  // Set up BCI simulator
  useEffect(() => {
    if (!isClient) return;
    
    bciSimulator.onDataUpdate(handleBrainDataUpdate);
    
    return () => {
      bciSimulator.removeCallback(handleBrainDataUpdate);
      bciSimulator.stop();
    };
  }, [isClient, handleBrainDataUpdate]);

  // Session timer
  useEffect(() => {
    if (!isSessionActive || !isClient) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isClient]);

  // Loading state for SSR compatibility
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-cyan-400 animate-pulse text-lg">Loading BCI Interface...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with model selection */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins text-glow">
            BCI Dashboard
          </h1>
          <p className="text-gray-400">Real-time brain state visualization and interaction</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedModel.id} onValueChange={(value) => {
            const model = PRESET_MODELS.find(m => m.id === value);
            if (model) setSelectedModel(model);
          }}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {PRESET_MODELS.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={showModelSelector} onOpenChange={setShowModelSelector}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-cyan-600 text-cyan-400 hover:bg-cyan-950">
                <Upload className="h-4 w-4 mr-2" />
                Upload Model
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Upload 3D Model</DialogTitle>
              </DialogHeader>
              <ModelUpload onUpload={handleModelUpload} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Left column - 3D Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Model Viewer */}
          <div className="h-2/3">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">3D Model Viewer</h2>
                <div className="flex items-center space-x-2">
                  <Box className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-cyan-400">{selectedModel.name}</span>
                </div>
              </div>
              
              <div className="h-full">
                <ModelViewer 
                  brainMetrics={brainMetrics}
                  modelType={selectedModel.type}
                  className="h-full"
                />
              </div>
            </div>
          </div>

          {/* Brain Wave Chart */}
          <div className="h-1/3">
            <BrainWaveChart data={brainWaveHistory} />
          </div>
        </div>

        {/* Right column - Controls and Metrics */}
        <div className="space-y-6">
          {/* Energetic Signature Gauge */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="flex justify-center">
              <EnergeticSignatureGauge 
                value={brainMetrics.energeticSignature} 
                size="md"
              />
            </div>
          </div>

          {/* Session Controls */}
          <SessionControls
            isSessionActive={isSessionActive}
            currentState={currentTargetState}
            onStartSession={handleStartSession}
            onStopSession={handleStopSession}
            onStateChange={handleStateChange}
            onResetSession={handleResetSession}
            sessionDuration={sessionDuration}
          />

          {/* Metrics Panel */}
          <MetricsPanel metrics={brainMetrics} />
        </div>
      </div>

      {/* Game Instructions */}
      {!isSessionActive && (
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-6 border border-cyan-800/50">
          <div className="flex items-start space-x-4">
            <Brain className="h-8 w-8 text-cyan-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">How to Play</h3>
              <div className="text-gray-300 space-y-2 text-sm">
                <p>1. Select a target brain state (meditation, focus, relaxation, or flow)</p>
                <p>2. Choose a 3D model that will respond to your mental state</p>
                <p>3. Start a session and watch as the model reacts to your simulated brain waves</p>
                <p>4. Try to achieve high energetic signature scores by maintaining your target state</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
