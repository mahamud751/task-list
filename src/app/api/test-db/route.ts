import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // Test database connection by fetching the count of each model
    const userCount = await prisma.user.count();
    const columnCount = await prisma.column.count();
    const taskCount = await prisma.task.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      counts: {
        users: userCount,
        columns: columnCount,
        tasks: taskCount,
      },
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}