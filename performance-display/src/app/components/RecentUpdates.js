"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function RecentUpdates({ locale }) {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const performancesPerPage = 10;
  const [popularityFilter, setPopularityFilter] = useState(0);
  const [customPopularity, setCustomPopularity] = useState('');

  const columns = {
    zh: ['演出名称', '地点', '查看详情', '艺术家', '开始时间', '热门指数'],
    en: ['Performance', 'Venue', 'Details', 'Artist', 'Start Time', 'Popularity'],
    jp: ['公演名', '会場', '詳細', 'アーティスト', '開始時間', '人気指数']
  };

  const langMap = {
    zh: 'cn',
    en: 'en',
    jp: 'jp'
  };

  const langCode = langMap[locale];

  const popularityFilterText = {
    zh: { all: '全部', custom: '自定义', apply: '应用', popularity: '演出热度' },
    en: { all: 'All', custom: 'Custom', apply: 'Apply', popularity: 'Performance Popularity' },
    jp: { all: 'すべて', custom: 'カスタム', apply: '適用', popularity: '公演の人気度' }
  };

  const viewDetailsText = {
    zh: '查看详情',
    en: 'View Details',
    jp: '詳細を見る'
  };

  useEffect(() => {
    fetchRecentUpdates(currentPage, popularityFilter);
  }, [currentPage, popularityFilter]);

  async function fetchRecentUpdates(page, popularity) {
    setLoading(true);
    try {
      const response = await fetch(`/api/newinfo?page=${page}&limit=${performancesPerPage}&popularity=${popularity}`);
      const data = await response.json();
      
      setPerformances(data.documents);
      setTotalPages(Math.ceil(data.total / performancesPerPage));
      setLoading(false);
    } catch (error) {
      console.error('获取最近更新的演出数据失败:', error);
      setLoading(false);
    }
  }

  const handlePopularityFilter = (value) => {
    setPopularityFilter(value);
    setCurrentPage(1);
    fetchRecentUpdates(1, value);
  };

  const handleCustomPopularityFilter = () => {
    const value = parseInt(customPopularity, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      handlePopularityFilter(value);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="mt-8 flow-root">
      {/* 热门指数筛选按钮 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {popularityFilterText[locale].popularity}
        </h3>
        <div className="flex flex-wrap items-center">
          <button
            onClick={() => handlePopularityFilter(0)}
            className={`px-4 py-2 mr-2 mb-2 rounded ${
              popularityFilter === 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {popularityFilterText[locale].all}
          </button>
          {[80, 70, 50].map((value) => (
            <button
              key={value}
              onClick={() => handlePopularityFilter(value)}
              className={`px-4 py-2 mr-2 mb-2 rounded ${
                popularityFilter === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {value}+
            </button>
          ))}
          <div className="flex items-center">
            <input
              type="number"
              value={customPopularity}
              onChange={(e) => setCustomPopularity(e.target.value)}
              placeholder={popularityFilterText[locale].custom}
              className="px-4 py-2 mr-2 mb-2 border rounded w-24 text-gray-700"
              min="0"
              max="100"
            />
            <button
              onClick={handleCustomPopularityFilter}
              className="px-4 py-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {popularityFilterText[locale].apply}
            </button>
          </div>
        </div>
      </div>

      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {columns[locale].map((column, index) => (
                  <th key={index} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performances.map((performance) => (
                <tr key={performance.$id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{performance[`pername_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`place_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link href={`/${locale}/performance/${performance.$id}`} className="text-indigo-600 hover:text-indigo-900">
                      {viewDetailsText[locale]}
                      <span className="sr-only">, {performance[`pername_${langCode}`]}</span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`artist_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(performance.start_time).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance.hot_index}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                上一页
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentUpdates;