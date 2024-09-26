import { getTranslations, getLocale } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import RecentUpdates from '../../components/RecentUpdates';

export default async function RecentUpdatesPage() {
  const locale = await getLocale();
  const t = await getTranslations('RecentUpdates');

  return (
    <div className="bg-white min-h-screen">
      <Navigation locale={locale} />
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-black">{t('title')}</h1>
          
          {/* 最近更新的演出信息表格 */}
          <div className="mt-8">
            <RecentUpdates locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
