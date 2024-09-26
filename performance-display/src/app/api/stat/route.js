import { Client, Databases, Query } from 'appwrite';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e18c7100141ca37061');

  const databases = new Databases(client);

  try {
    // 获取总演出数
    const totalPerformances = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      [Query.limit(1)]
    );

    // 获取近5天新增数量
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const recentPerformances = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      [
        Query.greaterThan('create_at', fiveDaysAgo.toISOString()),
        Query.limit(1)
      ]
    );

    // 获取热门演出数量
    const popularPerformances = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      [
        Query.greaterThanEqual('hot_index', 80),
        Query.limit(1)
      ]
    );

    return NextResponse.json({
      totalPerformances: totalPerformances.total >= 5000 ? '5000+' : totalPerformances.total,
      recentPerformances: recentPerformances.total >= 5000 ? '5000+' : recentPerformances.total,
      popularPerformances: popularPerformances.total >= 5000 ? '5000+' : popularPerformances.total
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    return NextResponse.json({ 
      error: '获取统计数据失败', 
      details: error.message
    }, { status: error.code || 500 });
  }
}
