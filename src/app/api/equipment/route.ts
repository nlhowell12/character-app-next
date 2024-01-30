import { NextRequest, NextResponse } from 'next/server';
import { equipmentRepo } from '../equipmentRepo';

export async function GET(req: NextRequest) {
    const equipment = await equipmentRepo.getEquipment();
    return NextResponse.json(equipment);
}
