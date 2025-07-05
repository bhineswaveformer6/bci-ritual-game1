
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        brainMetrics: {
          select: {
            energeticSignature: true,
            timestamp: true,
          },
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sessions' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetState, modelUsed } = body;

    const session = await prisma.session.create({
      data: {
        targetState: targetState || 'NEUTRAL',
        modelUsed: modelUsed || null,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create session' 
      },
      { status: 500 }
    );
  }
}
