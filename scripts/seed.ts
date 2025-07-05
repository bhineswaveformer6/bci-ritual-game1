
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed preset 3D models
  const presetModels = [
    {
      filename: 'sphere-preset',
      originalName: 'Meditative Sphere',
      fileSize: 1024,
      fileType: 'GLTF' as const,
      isPreset: true,
      description: 'A perfect sphere for meditation and focus practices. Responds beautifully to alpha and theta waves.',
      vertexCount: 1026,
      triangleCount: 2048,
      hasAnimations: false,
      hasMaterials: true,
      boundingBoxSize: 2.0,
    },
    {
      filename: 'cube-preset',
      originalName: 'Focus Cube',
      fileSize: 768,
      fileType: 'GLTF' as const,
      isPreset: true,
      description: 'A geometric cube ideal for concentration and beta wave enhancement.',
      vertexCount: 24,
      triangleCount: 12,
      hasAnimations: false,
      hasMaterials: true,
      boundingBoxSize: 2.0,
    },
    {
      filename: 'torus-preset',
      originalName: 'Flow Torus',
      fileSize: 2048,
      fileType: 'GLTF' as const,
      isPreset: true,
      description: 'A flowing torus shape perfect for achieving flow states and coherence.',
      vertexCount: 1600,
      triangleCount: 3200,
      hasAnimations: false,
      hasMaterials: true,
      boundingBoxSize: 2.8,
    },
    {
      filename: 'octahedron-preset',
      originalName: 'Energy Octahedron',
      fileSize: 512,
      fileType: 'GLTF' as const,
      isPreset: true,
      description: 'An energetic octahedron that amplifies gamma wave activity and mental clarity.',
      vertexCount: 6,
      triangleCount: 8,
      hasAnimations: false,
      hasMaterials: true,
      boundingBoxSize: 1.8,
    },
    {
      filename: 'icosahedron-preset',
      originalName: 'Harmonic Icosahedron',
      fileSize: 896,
      fileType: 'GLTF' as const,
      isPreset: true,
      description: 'A complex icosahedron for advanced practitioners seeking deeper brain coherence.',
      vertexCount: 12,
      triangleCount: 20,
      hasAnimations: false,
      hasMaterials: true,
      boundingBoxSize: 2.2,
    },
  ];

  console.log('Creating preset 3D models...');
  for (const model of presetModels) {
    const existingModel = await prisma.model3D.findUnique({
      where: { filename: model.filename },
    });

    if (!existingModel) {
      await prisma.model3D.create({ data: model });
      console.log(`✅ Created preset model: ${model.originalName}`);
    } else {
      console.log(`⏭️  Preset model already exists: ${model.originalName}`);
    }
  }

  // Seed default user settings
  console.log('Creating default user settings...');
  const existingSettings = await prisma.userSettings.findFirst();
  
  if (!existingSettings) {
    await prisma.userSettings.create({
      data: {
        dataSource: 'SIMULATOR',
        simulatorState: 'NEUTRAL',
        preferredModelId: null,
        dashboardLayout: 'default',
        chartUpdateRate: 100,
        cameraPosition: '0,0,5',
        autoRotate: true,
        ambientLightIntensity: 0.4,
        waveAmplitudeScale: 1.0,
        noiseLevel: 0.1,
        transitionSpeed: 1.0,
      },
    });
    console.log('✅ Created default user settings');
  } else {
    console.log('⏭️  User settings already exist');
  }

  // Create sample demo session with brain metrics (optional)
  console.log('Creating demo session...');
  const existingSession = await prisma.session.findFirst({
    where: { notes: 'Demo session for BCI Ritual Game' },
  });

  if (!existingSession) {
    const demoSession = await prisma.session.create({
      data: {
        targetState: 'DEEP_MEDITATION',
        status: 'COMPLETED',
        modelUsed: 'sphere-preset',
        duration: 300, // 5 minutes
        peakEnergeticScore: 85.4,
        averageEnergeticScore: 72.1,
        notes: 'Demo session for BCI Ritual Game',
        endTime: new Date(),
      },
    });

    // Add some sample brain metrics for the demo session
    const sampleMetrics = Array.from({ length: 10 }, (_, i) => ({
      sessionId: demoSession.id,
      timestamp: new Date(Date.now() - (10 - i) * 30000), // 30 seconds apart
      deltaWave: Math.random() * 0.5 + 0.3,
      thetaWave: Math.random() * 0.8 + 0.7, // Higher for meditation
      alphaWave: Math.random() * 0.6 + 0.5,
      betaWave: Math.random() * 0.3 + 0.1, // Lower for meditation
      gammaWave: Math.random() * 0.2 + 0.1,
      alphaTheta: Math.random() * 1.5 + 0.8,
      betaGammaAlpha: Math.random() * 0.5 + 0.2,
      coherence: Math.random() * 0.3 + 0.6, // High coherence
      energeticSignature: Math.random() * 20 + 65, // 65-85 range
      focusScore: Math.random() * 20 + 40,
      calmScore: Math.random() * 25 + 65, // High calm for meditation
      meditationDepth: Math.random() * 20 + 70, // High meditation depth
    }));

    await prisma.brainMetric.createMany({
      data: sampleMetrics,
    });

    console.log('✅ Created demo session with brain metrics');
  } else {
    console.log('⏭️  Demo session already exists');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
