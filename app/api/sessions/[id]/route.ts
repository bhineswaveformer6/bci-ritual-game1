
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, duration, peakEnergeticScore, averageEnergeticScore, notes } = body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(duration && { duration }),
        ...(peakEnergeticScore !== undefined && { peakEnergeticScore }),
        ...(averageEnergeticScore !== undefined && { averageEnergeticScore }),
        ...(notes && { notes }),
        ...(status === 'COMPLETED' && { endTime: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update session' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        brainMetrics: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch session' 
      },
      { status: 500 }
    );
  }
}
