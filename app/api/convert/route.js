import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request) {
  const id = randomUUID();
  const inputPath = join(tmpdir(), `mockframe-${id}.webm`);
  const outputPath = join(tmpdir(), `mockframe-${id}.mp4`);

  try {
    const formData = await request.formData();
    const file = formData.get('video');

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // Convert WebM to MP4 using system ffmpeg
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -movflags +faststart -y "${outputPath}"`,
        { timeout: 120000 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`ffmpeg error: ${stderr || error.message}`));
          } else {
            resolve();
          }
        }
      );
    });

    const mp4Buffer = await readFile(outputPath);

    // Clean up temp files
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    return new NextResponse(mp4Buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="mockframe-recording.mp4"',
        'Content-Length': mp4Buffer.length.toString(),
      },
    });
  } catch (err) {
    // Clean up on error
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    return NextResponse.json(
      { error: 'Conversion failed', details: err.message },
      { status: 500 }
    );
  }
}