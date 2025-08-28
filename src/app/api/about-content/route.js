import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const aboutContentPath = path.join(process.cwd(), 'public', 'api', 'about-content.json');

export async function GET() {
  try {
    const jsonData = fs.readFileSync(aboutContentPath, 'utf8');
    const data = JSON.parse(jsonData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading about content:', error);
    return NextResponse.json(
      { error: 'Failed to load about content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate data structure
    const requiredFields = ['companyOverview', 'mission', 'vision', 'values'];
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'object') {
        return NextResponse.json(
          { error: `Invalid or missing field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Write to file
    fs.writeFileSync(aboutContentPath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'About content updated successfully',
      data 
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}
