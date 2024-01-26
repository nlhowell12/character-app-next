import { NextRequest, NextResponse } from 'next/server';
import { classAbilityRepo } from '../classAbilityRepo';

export async function GET(req: NextRequest) {
    const classAbilities = await classAbilityRepo.getAll();
    return NextResponse.json(classAbilities);
}
