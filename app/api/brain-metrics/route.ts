
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      deltaWave,
      thetaWave,
      alphaWave,
      betaWave,
      gammaWave,
      alphaTheta,
      betaGammaAlpha,
      coherence,
      energeticSignature,
      focusScore,
      calmScore,
      meditationDepth,
    } = body;

    const brainMetric = await prisma.brainMetric.create({
      data: {
        sessionId,
        deltaWave: deltaWave || 0,
        thetaWave: thetaWave || 0,
        alphaWave: alphaWave || 0,
        betaWave: betaWave || 0,
        gammaWave: gammaWave || 0,
        alphaTheta: alphaTheta || 0,
        betaGammaAlpha: betaGammaAlpha || 0,
        coherence: coherence || 0,
        energeticSignature: energeticSignature || 0,
        focusScore: focusScore || 0,
        calmScore: calmScore || 0,
        meditationDepth: meditationDepth || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: brainMetric,
    });
  } catch (error) {
    console.error('Error creating brain metric:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create brain metric' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required' 
        },
        { status: 400 }
      );
    }

    const brainMetrics = await prisma.brainMetric.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: brainMetrics,
    });
  } catch (error) {
    console.error('Error fetching brain metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brain metrics' 
      },
      { status: 500 }
    );
  }
}
