import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const judgeId = searchParams.get('judgeId');
  
  try {
    const dataPath = path.join(process.cwd(), 'data', 'responses.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const responses = JSON.parse(data);
    return NextResponse.json(responses[judgeId] || null);
  } catch {
    return NextResponse.json(null);
  }
}