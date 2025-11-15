import { NextResponse } from 'next/server';
import { getServerCachedAirports } from '@/features/airports/services/serverCache';

export async function GET() {
  try {
    const { airports, total } = await getServerCachedAirports();
    
    return NextResponse.json({
      airports,
      total
    });
  } catch (error) {
    console.error('Error en API route /api/airports:', error);
    return NextResponse.json(
      { error: 'Error al cargar aeropuertos' },
      { status: 500 }
    );
  }
}

