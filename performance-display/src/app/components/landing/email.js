'use client'
import { useState } from 'react';

export default function ConcertSubscription({ locale }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const translations = {
    zh: {
      title: '订阅我们的演出通知',
      subtitle: '获取最新的演出信息和独家优惠',
      emailLabel: '电子邮箱地址',
      emailPlaceholder: '输入您的电子邮箱',
      subscribeButton: '订阅',
      privacyNotice: '我们尊重您的隐私，不会向第三方分享您的信息。',
      successMessage: '订阅成功！感谢您的关注。',
      errorMessage: '订阅失败，请稍后重试。'
    },
    en: {
      title: 'Subscribe to Our Concert Notifications',
      subtitle: 'Get the latest performance information and exclusive offers',
      emailLabel: 'Email address',
      emailPlaceholder: 'Enter your email',
      subscribeButton: 'Subscribe',
      privacyNotice: 'We respect your privacy and will not share your information with third parties.',
      successMessage: 'Subscription successful! Thank you for your interest.',
      errorMessage: 'Subscription failed, please try again later.'
    },
    jp: {
      title: 'コンサート通知を購読する',
      subtitle: '最新の公演情報と限定オファーを入手',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'メールアドレスを入力',
      subscribeButton: '購読',
      privacyNotice: '私たちはあなたのプライバシーを尊重し、第三者とあなたの情報を共有することはありません。',
      successMessage: '購読に成功しました！ご関心をお寄せいただきありがとうございます。',
      errorMessage: '購読に失敗しました。後でもう一度お試しください。'
    }
  };

  const t = translations[locale];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(t.successMessage);
        setEmail('');
      } else {
        setMessage(t.errorMessage);
      }
    } catch (error) {
      console.error('订阅错误:', error);
      setMessage(t.errorMessage);
    }
  };

  return (
    <div className="bg-gray-100 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t.title}
            </h2>
            <p className="mt-2 text-lg text-gray-600">{t.subtitle}</p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form onSubmit={handleSubmit} className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                {t.emailLabel}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full rounded-md border-gray-300 px-4 py-2 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {t.subscribeButton}
                </button>
              </div>
            </form>
            {message && (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
            <p className="mt-3 text-sm text-gray-500">
              {t.privacyNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
