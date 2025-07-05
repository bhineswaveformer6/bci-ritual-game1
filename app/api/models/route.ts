
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const models = await prisma.model3D.findMany({
      orderBy: [
        { isPreset: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: models,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch models' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      filename,
      originalName,
      fileSize,
      fileType,
      description,
      vertexCount,
      triangleCount,
      hasAnimations,
      hasMaterials,
      boundingBoxSize,
    } = body;

    const model = await prisma.model3D.create({
      data: {
        filename,
        originalName,
        fileSize: fileSize || 0,
        fileType: fileType || 'GLTF',
        description: description || null,
        vertexCount: vertexCount || null,
        triangleCount: triangleCount || null,
        hasAnimations: hasAnimations || false,
        hasMaterials: hasMaterials || false,
        boundingBoxSize: boundingBoxSize || null,
        isPreset: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create model' 
      },
      { status: 500 }
    );
  }
}
