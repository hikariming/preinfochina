import { Client, Databases, Query } from 'appwrite';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const field = searchParams.get('field') || 'all';
  const popularity = parseInt(searchParams.get('popularity') || '0');

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e18c7100141ca37061');

  const databases = new Databases(client);

  try {
    let queries = [
      Query.limit(limit),
      Query.offset((page - 1) * limit)
    ];

    if (search) {
      const searchFields = field === 'all' 
        ? ['pername_cn', 'pername_en', 'pername_jp', 'location_cn', 'location_en', 'location_jp', 'artist_cn', 'artist_en', 'artist_jp','place_cn','place_en','place_jp']
        : field === 'pername' 
          ? ['pername_cn', 'pername_en', 'pername_jp']
          : field === 'location'
            ? ['location_cn', 'location_en', 'location_jp']
            : field === 'artist'
              ? ['artist_cn', 'artist_en', 'artist_jp']
              : field === 'place'
                ? ['place_cn', 'place_en', 'place_jp']
              : [];

      if (searchFields.length > 0) {
        queries.push(Query.or(searchFields.map(field => Query.search(field, search, ['fuzziness']))));
      }
    }

    // 添加热门指数筛选
    if (popularity > 0) {
      queries.push(Query.greaterThanEqual('hot_index', popularity));
    }

    const response = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      queries
    );

    return NextResponse.json({
      documents: response.documents,
      total: response.total
    });
  } catch (error) {
    console.error('搜索错误:', error);
    console.error('错误详情:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: '获取数据失败', 
      details: error.message,
      code: error.code,
      type: error.type,
      response: error.response
    }, { status: error.code || 500 });
  }
}

// 添加新的 GET 函数用于获取单条数据
export async function GETSINGLE(request, { params }) {
  const id = params.id;

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e18c7100141ca37061');

  const databases = new Databases(client);

  try {
    const response = await databases.getDocument(
      'perinfo',
      '66e56af1001dac90eefb',
      id
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('获取单条数据错误:', error);
    return NextResponse.json({ 
      error: '获取数据失败', 
      details: error.message
    }, { status: error.code || 500 });
  }
}

// 新增的 GET 函数用于获取统计数据
export async function GETSTATS() {
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
      [Query.greaterThan('create_at', fiveDaysAgo.toISOString())]
    );

    // 获取热门演出数量
    const popularPerformances = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      [Query.greaterThanEqual('hot_index', 80)]
    );

    // 计算百分比
    const recentPercentage = (recentPerformances.total / totalPerformances.total * 100).toFixed(2);
    const popularPercentage = (popularPerformances.total / totalPerformances.total * 100).toFixed(2);

    return NextResponse.json({
      totalPerformances: totalPerformances.total,
      recentPerformances: recentPerformances.total,
      recentPercentage: `${recentPercentage}%`,
      popularPerformances: popularPerformances.total,
      popularPercentage: `${popularPercentage}%`
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    return NextResponse.json({ 
      error: '获取统计数据失败', 
      details: error.message
    }, { status: error.code || 500 });
  }
}