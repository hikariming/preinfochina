"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function PerformanceTable({ locale }) {
  const [performances, setPerformances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [popularityFilter, setPopularityFilter] = useState(0);
  const [customPopularity, setCustomPopularity] = useState('');

  const columns = {
    zh: ['演出名称', '区域', '艺术家', '地点', '热门指数', '操作'],
    en: ['Performance', 'Area', 'Artist', 'Venue', 'Popularity', 'Action'],
    jp: ['公演名', 'エリア', 'アーティスト', '会場', '人気指数', 'アクション']
  };

  const langMap = {
    zh: 'cn',
    en: 'en',
    jp: 'jp'
  };

  const langCode = langMap[locale];

  const viewDetailsText = {
    zh: '查看详情',
    en: 'View Details',
    jp: '詳細を見る'
  };

  useEffect(() => {
    fetchPerformances(currentPage, searchTerm, searchField, popularityFilter);
  }, [currentPage, searchTerm, searchField, popularityFilter]);

  async function fetchPerformances(page, search, field, popularity) {
    try {
      const response = await fetch(`/api/performances?page=${page}&limit=10&search=${search}&field=${field}&popularity=${popularity}`);
      const data = await response.json();
      setPerformances(data.documents);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error('获取演出数据失败:', error);
    }
  }

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPerformances(1, searchTerm, searchField, popularityFilter);
  };

  const handlePopularityFilter = (value) => {
    setPopularityFilter(value);
    setCurrentPage(1);
    fetchPerformances(1, searchTerm, searchField, value);
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

  const searchFieldOptions = {
    zh: [
      { value: 'all', label: '全部字段' },
      { value: 'pername', label: '演出名称' },
      { value: 'location', label: '区域' },
      { value: 'artist', label: '艺术家' },
      { value: 'place', label: '地点' }
    ],
    en: [
      { value: 'all', label: 'All Fields' },
      { value: 'pername', label: 'Performance Name' },
      { value: 'location', label: 'Location' },
      { value: 'artist', label: 'Artist' },
      { value: 'place', label: 'Place' }
    ],
    jp: [
      { value: 'all', label: '全フィールド' },
      { value: 'pername', label: '公演名' },
      { value: 'location', label: '区域' },
      { value: 'artist', label: 'アーティスト' },
      { value: 'place', label: '場所' }
    ]
  };

  const searchButtonText = {
    zh: '搜索',
    en: 'Search',
    jp: '検索'
  };

  const popularityFilterText = {
    zh: { all: '全部', custom: '自定义', apply: '应用', popularity: '演出热度' },
    en: { all: 'All', custom: 'Custom', apply: 'Apply', popularity: 'Performance Popularity' },
    jp: { all: 'すべて', custom: 'カスタム', apply: '適用', popularity: '公演の人気度' }
  };

  return (
    <div>
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

      {/* 搜索功能 */}
      <div className="mb-4 flex flex-wrap items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={locale === 'zh' ? "搜索..." : locale === 'en' ? "Search..." : "検索..."}
          className="px-4 py-2 border rounded mr-2 mb-2"
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-4 py-2 border rounded mr-2 mb-2"
        >
          {searchFieldOptions[locale].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {searchButtonText[locale]}
        </button>
      </div>

      {/* 表格 */}
      <div className="mt-8 flow-root">
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`location_${langCode}`]}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`artist_${langCode}`]}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance[`place_${langCode}`]}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{performance.hot_index}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/${locale}/performance/${performance.$id}`} className="text-indigo-600 hover:text-indigo-900">
                        {viewDetailsText[locale]}
                        <span className="sr-only">, {performance[`pername_${langCode}`]}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 分页 */}
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
  );
}

export default PerformanceTable;