import { getTranslations, getLocale } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import VenuePerformances from '../../components/VenuePerformances';

const venues = [
  {
    id: 1,
    name: {
      zh: '梅赛德斯奔驰中心',
      jp: 'メルセデス・ベンツ・アリーナ',
      en: 'Mercedes-Benz Arena',
    },
    city: {
      zh: '上海',
      jp: '上海',
      en: 'Shanghai',
    },
    description: {
      zh: '上海最大的多功能场馆,可容纳18000人,举办过众多国际级演唱会。',
      jp: '上海最大の多目的アリーナで、18000人収容可能、数多くの国際的なコンサートが開催されました。',
      en: 'The largest multi-purpose arena in Shanghai, with a capacity of 18,000 people, has hosted numerous international concerts.',
    },
    imageUrl: '/images/venues/mei.jpg',
  },
  {
    id: 2,
    name: {
      zh: '东安湖',
      jp: '東安湖',
      en: 'Dong an Lake',
    },
    city: {
      zh: '成都',
      jp: '成都',
      en: 'Chengdu',
    },
    description: {
      zh: '成都最现代化的体育场馆群,包括6万人体育场、1.3万人体育馆等。',
      jp: '成都で最も近代的なスポーツ施設群で、6万人収容のスタジアム、1.3万人収容のアリーナなどがあります。',
      en: 'The most modern sports complex in Chengdu, including a 60,000-seat stadium and a 13,000-seat arena.',
    },
    imageUrl: '/images/venues/donganhu.jpg',
  },
  {
    id: 3,
    name: {
      zh: '虹馆',
      jp: '虹館',
      en: 'Hongguan',
    },
    city: {
      zh: '上海',
      jp: '上海',
      en: 'Shanghai',
    },
    description: {
      zh: '上海世博会时期建设的音乐场馆。',
      jp: '上海万博の時期に建設された音楽ホール。',
      en: 'A music venue built during the Shanghai World Expo.',
    },
    imageUrl: '/images/venues/hongguan.jpg',
  },
  {
    id: 4,
    name: {
      zh: '五源河体育中心',
      jp: '五源河体育センター',
      en: 'Wuyuanhe Sports Center',
    },
    city: {
      zh: '海口',
      jp: '海口',
      en: 'Haikou',
    },
    description: {
      zh: '海南省最大的体育场馆,可容纳4.1万人。',
      jp: '海南省最大のスポーツ施設で、4.1万人収容可能。',
      en: 'The largest sports venue in Hainan Province, with a capacity of 41,000 people.',
    },
    imageUrl: '/images/venues/wuyuanhe.jpg',
  },
];

export default async function VenuesPage() {
  const locale = await getLocale();

  return (
    <div className="bg-white min-h-screen">
      <Navigation locale={locale} />
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="mx-auto mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {venues.map((venue) => (
              <article
                key={venue.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-4 pb-4 pt-40 sm:pt-24 lg:pt-40"
              >
                <img src={venue.imageUrl} alt={venue.name[locale]} className="absolute inset-0 -z-10 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <div className="mr-8">
                    {venue.city[locale]}
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  {venue.name[locale]}
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  {venue.description[locale]}
                </p>
              </article>
            ))}
          </div>

          {/* 新增: 场地演出表格 */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">场地演出列表</h2>
            <VenuePerformances locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
