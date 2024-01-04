import { NextRequest, NextResponse } from 'next/server';
import { characterRepo } from '../characterRepo';
import { NextApiRequest } from 'next';

export async function GET(req: NextRequest) {
    const user = req.nextUrl.searchParams.get('name');
    let characters;
    if(!user) {
        characters = await characterRepo.getAll();
    } else {
        characters = await characterRepo.getUser(user);
    }
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