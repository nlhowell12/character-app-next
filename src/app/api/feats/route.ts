import { NextRequest, NextResponse } from 'next/server';
import { featRepo } from '../featRepo';

export async function GET(req: NextRequest) {
    const feats = await featRepo.getFeats();
    return NextResponse.json(feats);
}
