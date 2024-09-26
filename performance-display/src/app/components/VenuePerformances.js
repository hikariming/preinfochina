"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function VenuePerformances({ locale }) {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const performancesPerPage = 10;

  const venues = ['梅赛德斯', '东安湖', '虹馆', '五源河'];

  const columns = {
    zh: ['演出名称', '地点', '艺术家', '演出时间', '热门指数'],
    en: ['Performance', 'Venue', 'Artist', 'Start Time', 'Popularity'],
    jp: ['公演名', '会場', 'アーティスト', '開演時間', '人気指数']
  };

  const langMap = {
    zh: 'cn',
    en: 'en',
    jp: 'jp'
  };

  const langCode = langMap[locale];

  useEffect(() => {
    fetchPerformances(currentPage);
  }, [currentPage]);

  async function fetchPerformances(page) {
    setLoading(true);
    try {
      const response = await fetch(`/api/venne?page=${page}&limit=${performancesPerPage}&venues=${JSON.stringify(venues)}`);
      const data = await response.json();
      
      setPerformances(data.documents);
      setTotalPages(Math.ceil(data.total / performancesPerPage));
      setLoading(false);
    } catch (error) {
      console.error('获取演出数据失败:', error);
      setLoading(false);
    }
  }

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
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {columns[locale].map((column, index) => (
                  <th key={index} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">{column}</th>
                ))}
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  {locale === 'zh' ? '详情' : locale === 'en' ? 'Details' : '詳細'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performances.map((performance) => (
                <tr key={performance.$id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{performance[`pername_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`place_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`artist_${langCode}`]}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(performance.start_time).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance.hot_index}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link href={`/${locale}/performance/${performance.$id}`} className="text-indigo-600 hover:text-indigo-900">
                      {locale === 'zh' ? '查看详情' : locale === 'en' ? 'View Details' : '詳細を見る'}
                    </Link>
                  </td>
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

export default VenuePerformances;