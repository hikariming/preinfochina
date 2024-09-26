'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = {
  zh: [
    { name: '首页', href: '/zh/dashboard' },
    { name: '全部演出', href: '/zh/allperformances' },
    { name: '热门场馆', href: '/zh/venues' },
    { name: '近48小时更新(限时免费)', href: '/zh/recent-updates' },
    { name: '关于', href: '/zh/about' },
  ],
  en: [
    { name: 'Home', href: '/en/dashboard' },
    { name: 'All Performances', href: '/en/allperformances' },
    { name: 'Popular Venues', href: '/en/venues' },
    { name: 'Updated in 48 Hours (Free)', href: '/en/recent-updates' },
    { name: 'About', href: '/en/about' },
  ],
  jp: [
    { name: 'ホーム', href: '/jp/dashboard' },
    { name: '全ての公演', href: '/jp/allperformances' },
    { name: '人気の会場', href: '/jp/venues' },
    { name: '48時間以内の更新（無料）', href: '/jp/recent-updates' },
    { name: '概要', href: '/jp/about' },
  ],
}

export default function Navigation({ locale = 'en' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const safeLocale = navigation[locale] ? locale : 'en'

  const loginText = {
    zh: '登录(TBD)',
    en: 'Login(TBD)',
    jp: 'ログイン(TBD)'
  }

  const companyName = {
    zh: '您的公司',
    en: 'Your Company',
    jp: 'あなたの会社'
  }

  const openMainMenuText = {
    zh: '打开主菜单',
    en: 'Open main menu',
    jp: 'メインメニューを開く'
  }

  const closeMenuText = {
    zh: '关闭菜单',
    en: 'Close menu',
    jp: 'メニューを閉じる'
  }

  const isActive = (href) => pathname === href

  return (
    <header className="bg-indigo-600">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href={`/${locale}/dashboard`} className="-m-1.5 p-1.5">
            <span className="sr-only">{companyName[locale]}</span>
            <img alt="" src="/images/logo.svg" className="h-12 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-indigo-300"
          >
            <span className="sr-only">{openMainMenuText[locale]}</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation[safeLocale].map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`text-sm font-semibold leading-6 px-3 py-2 rounded-md ${
                isActive(item.href) 
                  ? 'text-white bg-indigo-700' 
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href={`/${locale}/login`} className="text-sm font-semibold leading-6 text-white">
            {loginText[locale]} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation[safeLocale].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 ${
                      isActive(item.href)
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
