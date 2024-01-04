import { NextResponse } from 'next/server';
import { userRepo } from '../userRepo';

export async function POST(request: Request) {
    const body = await request.json();
    const user = await userRepo.logIn(body);
    return NextResponse.json(user);
}
export async function PUT(request: Request) {
    const body = await request.json();
    const user = await userRepo.create(body);
    return NextResponse.json(user);
}