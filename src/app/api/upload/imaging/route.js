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

        // Validate file type - DICOM files typically have .dcm extension
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.dcm')) {
            return NextResponse.json(
                { error: 'Only DCM files are allowed for imaging' },
                { status: 400 }
            );
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'upload', 'imaging');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const newFileName = `imaging_${timestamp}_${originalName}`;
        const filePath = join(uploadDir, newFileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Return the public URL
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