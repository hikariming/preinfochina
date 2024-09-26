import { getTranslations } from 'next-intl/server'
import Hero from '../components/landing/hero'
import WhyChina from '../components/landing/whyChina'
import Email from '../components/landing/email'

export default async function LandingPage({ params: { locale } }) {
  const t = await getTranslations('Landing')

  return (
    <div>
      <Hero t={t} />
      <WhyChina t={t} />
      <Email locale={locale} />
    </div>
  )
}
