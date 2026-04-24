import { NextRequest, NextResponse } from 'next/server';
import gerberToSvg from 'gerber-to-svg';

export const runtime = 'nodejs';

function streamToString(stream: NodeJS.ReadWriteStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let out = '';
    stream.on('data', (chunk) => {
      out += chunk.toString();
    });
    stream.on('end', () => resolve(out));
    stream.on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { gerber?: string };
    if (!body.gerber) {
      return NextResponse.json({ error: 'Missing gerber content' }, { status: 400 });
    }

    const converter = gerberToSvg(body.gerber) as any;
    converter.end();
    const svg = await streamToString(converter as NodeJS.ReadWriteStream);

    return NextResponse.json({ svg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to render Gerber' }, { status: 500 });
  }
}
