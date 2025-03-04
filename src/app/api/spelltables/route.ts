import { NextResponse } from 'next/server';
import { spellTableRepo } from '../spellTableRepo';

export async function GET(request: Request) {
    const spellTables = await spellTableRepo.getAll();
    return NextResponse.json(spellTables);
}
