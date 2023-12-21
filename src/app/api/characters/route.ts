import { NextResponse } from 'next/server';
import { characterRepo } from '../characterRepo';

export async function GET(request: Request) {
    const characters = await characterRepo.getAll();
    return NextResponse.json(characters);
}

export async function POST(request: Request) {
    try{
        const body = await request.json();
        await characterRepo.create(body);
        return NextResponse.json('Success', {status: 200});
    } catch(e) {
        return NextResponse.json(e, {status: 500});
    }
}

export async function PUT(request: Request) {
    try{
        const body = await request.json();
        await characterRepo.update(body);
        return NextResponse.json('Success', {status: 200});
    } catch(e) {
        return NextResponse.json(e, {status: 500});
    }
}