import { getTranslations, getLocale } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import Stat from '../../components/dashboard/stat';
import { Client, Databases, Query } from 'appwrite';
import PerformanceTable from '../../components/PerformanceTable';

async function fetchPerformances() {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e18c7100141ca37061');

  const databases = new Databases(client);

  try {
    const response = await databases.listDocuments(
      'perinfo',
      '66e56af1001dac90eefb',
      [
        Query.limit(10),
        Query.greaterThanEqual('hot_index', 80)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('获取演出数据失败:', error);
    return [];
  }
}

export default async function LandingPage() {
  const performances = await fetchPerformances();
  const locale = await getLocale();
  const t = await getTranslations('Dashboard');

  return (
    <div className="bg-white min-h-screen text-black">
      <Navigation locale={locale} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <Stat locale={locale} />
        
        <br />
        <PerformanceTable performances={performances} locale={locale} />
      </div>
    </div>
  );
}
