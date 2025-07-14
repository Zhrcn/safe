import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');
        const userId = formData.get('userId');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const type = 'profile';

        if (!file || !userId || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Missing required fields (image, userId, firstName, lastName)' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        // Create uploads/profile directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', type);
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Generate filename: [userId]-[firstName_lastName].jpg
        const safeName = `${firstName}_${lastName}`.replace(/[^a-zA-Z0-9_]/g, '');
        const fileName = `${userId}-${safeName}.jpg`;
        const filePath = join(uploadsDir, fileName);

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Use sharp to resize/crop to 256x256 and convert to jpg
        await sharp(buffer)
            .resize(256, 256, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toFile(filePath);

        // Return the public URL path
        const publicPath = `/uploads/${type}/${fileName}`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            fileName: fileName,
            size: file.size,
            type: 'image/jpeg'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
} 