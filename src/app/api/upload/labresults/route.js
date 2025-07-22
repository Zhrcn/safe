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

        if (!file.type.includes('pdf')) {
            return NextResponse.json(
                { error: 'Only PDF files are allowed for lab results' },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'public', 'upload', 'labresults');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `labresult_${timestamp}_${originalName}`;
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const publicUrl = `/upload/labresults/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName
        });

    } catch (error) {
        console.error('Lab results upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
} 