import { NextRequest, NextResponse } from 'next/server';
import { characterRepo } from '../characterRepo';

export async function GET(req: NextRequest) {
    const user = req.nextUrl.searchParams.get('name');
    const character = req.nextUrl.searchParams.get('character');
    let characters;
    if(!!character) {
        characters = await characterRepo.getChar(character);
    } else if(!!user){
        characters = await characterRepo.getUser(user);
    }else {
        characters = await characterRepo.getAll();
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

export async function DELETE(request: Request) {
    try{
        const body = await request.json();
        await characterRepo.remove(body);
        return NextResponse.json('Character Deleted', {status: 200});
    } catch(e) {
        return NextResponse.json(e, {status: 500});
    }
}