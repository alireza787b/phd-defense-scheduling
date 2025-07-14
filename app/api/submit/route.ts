import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'responses.json');

    await fs.mkdir(dataDir, { recursive: true });

    let responses: any = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      responses = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet
    }

    responses[data.judgeId] = data;
    await fs.writeFile(filePath, JSON.stringify(responses, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}