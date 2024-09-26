import { Client, Databases } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e18c7100141ca37061');

  const databases = new Databases(client);

  try {
    const { email } = await request.json();

    const response = await databases.createDocument(
      'perinfo',
      '66f526ee00264befd44f',
      'unique()',
      { email }
    );

    return NextResponse.json({ success: true, message: '订阅成功' });
  } catch (error) {
    console.error('订阅错误:', error);
    return NextResponse.json({ 
      error: '订阅失败', 
      details: error.message
    }, { status: error.code || 500 });
  }
}