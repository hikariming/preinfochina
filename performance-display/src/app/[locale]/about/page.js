import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');
  const currentLanguage = t('languageCode');

  return (
    <div className="bg-white">
      <main>
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                {t('title')}
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600">
                  {t('description')}
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href={`/${currentLanguage}/dashboard`}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {t('exploreEvents')}
                  </Link>
                  <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    {t('contactUs')} <span aria-hidden="true">→</span>
                  </a>
                  <span className="text-sm text-gray-600">972037896@qq.com</span>
                </div>
              </div>
              {/* <img
                src="/images/about-team.jpg"
                alt={t('teamImageAlt')}
                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              /> */}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
        </div>

        {/* 使命和愿景部分 */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('missionTitle')}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('missionDescription')}
            </p>
          </div>
        </div>

        {/* 团队介绍部分 */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('teamTitle')}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('teamDescription')}
            </p>
          </div>
          {/* 这里可以添加团队成员的卡片 */}
        </div>
      </main>
    </div>
  )
}