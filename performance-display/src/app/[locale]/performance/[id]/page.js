import { Client, Databases } from 'appwrite';
import { notFound } from 'next/navigation';

async function getPerformanceDetail(id) {
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
    return response;
  } catch (error) {
    console.error('获取演出详情时出错:', error);
    return null;
  }
}

export default async function PerformanceDetail({ params }) {
  const performance = await getPerformanceDetail(params.id);

  if (!performance) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">演出详情 / Performance Details / 公演詳細</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DetailSection title="中文" data={performance} lang="cn" />
        <DetailSection title="English" data={performance} lang="en" />
        <DetailSection title="日本語" data={performance} lang="jp" />
      </div>
    </div>
  );
}

function DetailSection({ title, data, lang }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <dl>
        <DetailItem 
          label={lang === 'cn' ? "演出名称" : lang === 'en' ? "Performance Name" : "公演名"} 
          value={data[`pername_${lang}`]} 
        />
        <DetailItem 
          label={lang === 'cn' ? "区域" : lang === 'en' ? "Location" : "地域"} 
          value={data[`location_${lang}`]} 
        />
        <DetailItem 
          label={lang === 'cn' ? "地点" : lang === 'en' ? "Place" : "場所"} 
          value={data[`place_${lang}`]} 
        />
        <DetailItem 
          label={lang === 'cn' ? "艺术家" : lang === 'en' ? "Artist" : "アーティスト"} 
          value={data[`artist_${lang}`]} 
        />
        <DetailItem 
          label={lang === 'cn' ? "开始时间" : lang === 'en' ? "Start Time" : "開始時間"} 
          value={formatDate(data.start_time)} 
        />
        <DetailItem 
          label={lang === 'cn' ? "结束时间" : lang === 'en' ? "End Time" : "終了時間"} 
          value={formatDate(data.end_time)} 
        />
        <DetailItem 
          label={lang === 'cn' ? "热门指数" : lang === 'en' ? "Hot Index" : "人気指数"} 
          value={data.hot_index} 
        />
      </dl>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <>
      <dt className="font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-gray-900 dark:text-gray-100 mb-4">{value}</dd>
    </>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}