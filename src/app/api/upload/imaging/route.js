import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.dcm')) {
            return NextResponse.json(
                { error: 'Only DCM files are allowed for imaging' },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'public', 'upload', 'imaging');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const newFileName = `imaging_${timestamp}_${originalName}`;
        const filePath = join(uploadDir, newFileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const publicUrl = `/upload/imaging/${newFileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: newFileName
        });

    } catch (error) {
        console.error('Imaging upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
} 