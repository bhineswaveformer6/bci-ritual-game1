
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.userSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          dataSource: 'SIMULATOR',
          simulatorState: 'NEUTRAL',
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
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the latest settings or create if none exist
    let settings = await prisma.userSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          dataSource: 'SIMULATOR',
          simulatorState: 'NEUTRAL',
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
    }

    const updatedSettings = await prisma.userSettings.update({
      where: { id: settings.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings' 
      },
      { status: 500 }
    );
  }
}
