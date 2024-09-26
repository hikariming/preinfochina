'use client';

import { useState, useEffect } from 'react';

async function fetchStats() {
  const response = await fetch('/api/stat', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('获取统计数据失败');
  }
  return response.json();
}

export default function Example({ locale }) {
  const statNames = {
    zh: ['总演出数', '近5天新增', '热门演出'],
    en: ['Total Performances', 'New in 5 Days', 'Popular Performances'],
    jp: ['総公演数', '5日間の新規', '人気公演']
  };

  const loadingText = {
    zh: '加载中...',
    en: 'Loading...',
    jp: '読み込み中...'
  };

  const errorText = {
    zh: '加载失败',
    en: 'Load Failed',
    jp: '読み込み失敗'
  };

  const [stats, setStats] = useState(statNames[locale].map(name => ({ name, stat: loadingText[locale] })));

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats([
          { name: statNames[locale][0], stat: data.totalPerformances.toLocaleString() },
          { name: statNames[locale][1], stat: data.recentPerformances.toLocaleString() },
          { name: statNames[locale][2], stat: data.popularPerformances.toLocaleString() },
        ]);
      } catch (error) {
        console.error('获取统计数据失败:', error);
        setStats(statNames[locale].map(name => ({ name, stat: errorText[locale] })));
      }
    }

    loadStats();
  }, [locale]);

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
