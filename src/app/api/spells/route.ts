import { NextResponse } from 'next/server';
import { spellRepo } from './../spellRepo';

export async function GET(request: Request) {
    const spells = await spellRepo.getAll();
    return NextResponse.json(spells);
}