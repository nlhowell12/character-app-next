import { NextResponse } from 'next/server';
import { characterRepo } from '../characterRepo';

export async function GET(request: Request) {
    const characters = await characterRepo.getAll();
    return NextResponse.json(characters);
}