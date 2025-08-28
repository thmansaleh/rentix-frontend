import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'websiteContent.json');

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    const defaultData = {
      aboutUs: '',
      terms: '',
      contactText: '',
      socials: []
    };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export async function GET() {
  try {
    await ensureFile();
    const raw = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load content', details: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureFile();
    const body = await req.json();
    const { aboutUs, terms, contactText, socials } = body;
    if (!Array.isArray(socials)) {
      return NextResponse.json({ error: 'socials must be an array' }, { status: 400 });
    }
    const data = { aboutUs: aboutUs ?? '', terms: terms ?? '', contactText: contactText ?? '', socials };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save content', details: e.message }, { status: 500 });
  }
}
