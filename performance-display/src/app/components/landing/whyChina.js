import { MusicalNoteIcon, TicketIcon, CameraIcon, BanknotesIcon } from '@heroicons/react/24/outline'

const featureIcons = [MusicalNoteIcon, TicketIcon, CameraIcon, BanknotesIcon]

export default function Example({ t }) {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">{t('whyChina.subtitle')}</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('whyChina.title')}</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t('whyChina.description')}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {[0, 1, 2, 3].map((index) => {
                  const Icon = featureIcons[index];
                  return (
                    <div key={index} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <Icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                        {t(`whyChina.features.${index}.name`)}
                      </dt>{' '}
                      <dd className="inline">{t(`whyChina.features.${index}.description`)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <img
              alt="Product screenshot"
              src="/images/landing/table.png"
              width={2432}
              height={1442}
              className="w-full lg:w-[120%] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
