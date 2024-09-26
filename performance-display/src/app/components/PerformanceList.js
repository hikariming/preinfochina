'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PerformanceList({ lang }) {
  const router = useRouter();
  const [performances, setPerformances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const limit = 10;
  const [inputPage, setInputPage] = useState('');
  const [popularityFilter, setPopularityFilter] = useState(80);
  const [customPopularity, setCustomPopularity] = useState('');

  useEffect(() => {
    // 页面首次加载时搜索热门指数大于80的数据
    fetchPerformances(1, '', 'all', 80);
  }, []);

  async function fetchPerformances(page, search, field, popularity) {
    const response = await fetch(`/api/performances?page=${page}&limit=${limit}&search=${search}&field=${field}&popularity=${popularity}`);
    const data = await response.json();
    setPerformances(data.documents);
    setTotalPages(Math.ceil(data.total / limit));
    setCurrentPage(page);
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
      fetchPerformances(newPage, searchTerm, searchField, popularityFilter);
    }
  };

  const handleInputPageChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setInputPage('');
    }
  };

  const columns = {
    zh: ['演出名称', '区域', '地点', '开始时间', '结束时间', '艺术家', '热门指数', '操作'],
    en: ['Performance', 'Area', 'Location', 'Start Time', 'End Time', 'Artist', 'Popularity', 'Action'],
    jp: ['公演名', 'エリア', '場所', '開始時間', '終了時間', 'アーティスト', '人気指数', 'アクション']
  };

  // 语言代码映射
  const langMap = {
    zh: 'cn',
    en: 'en',
    jp: 'jp'
  };

  // 正确的语言代码
  const langCode = langMap[lang];

  const searchFieldOptions = {
    zh: [
      { value: 'all', label: '全部字段' },
      { value: 'pername', label: '演出名称' },
      { value: 'location', label: '区域' },
      { value: 'artist', label: '艺术家' },
      { value: 'palce', label: '地点' }
    ],
    en: [
      { value: 'all', label: 'All Fields' },
      { value: 'pername', label: 'Performance Name' },
      { value: 'location', label: 'Location' },
      { value: 'artist', label: 'Artist' },
      { value: 'palce', label: 'Place' }
    ],
    jp: [
      { value: 'all', label: '全フィールド' },
      { value: 'pername', label: '公演名' },
      { value: 'location', label: '区域' },
      { value: 'artist', label: 'アーティスト' },
      { value: 'palce', label: '場所' }
    ]
  };

  const searchButtonText = {
    zh: '搜索',
    en: 'Search',
    jp: '検索'
  };

  const searchInstructions = {
    zh: '请按字段进行检索',
    en: 'Please search by field',
    jp: 'フィールドで検索してください'
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  const paginationText = {
    zh: { prev: '上一页', next: '下一页', current: '第', total: '页，共', pages: '页', jump: '跳转' },
    en: { prev: 'Previous', next: 'Next', current: 'Page', total: 'of', pages: 'pages', jump: 'Jump' },
    jp: { prev: '前へ', next: '次へ', current: 'ページ', total: '/', pages: 'ページ', jump: 'ジャンプ' }
  };

  const popularityFilterText = {
    zh: { all: '全部', custom: '自定义', apply: '应用', popularity: '演出热度' },
    en: { all: 'All', custom: 'Custom', apply: 'Apply', popularity: 'Performance Popularity' },
    jp: { all: 'すべて', custom: 'カスタム', apply: '適用', popularity: '公演の人気度' }
  };

  const handleViewDetails = (performanceId) => {
    router.push(`/performance/${performanceId}`);
  };

  return (
    <div className="flex flex-col">
      {/* 热门指数筛选按钮 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-black-200">
          {popularityFilterText[lang].popularity}
        </h3>
        <div className="flex flex-wrap items-center">
          <button
            onClick={() => handlePopularityFilter(0)}
            className={`px-4 py-2 mr-2 mb-2 rounded ${
              popularityFilter === 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {popularityFilterText[lang].all}
          </button>
          {[80, 70, 50].map((value) => (
            <button
              key={value}
              onClick={() => handlePopularityFilter(value)}
              className={`px-4 py-2 mr-2 mb-2 rounded ${
                popularityFilter === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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
              placeholder={popularityFilterText[lang].custom}
              className="px-4 py-2 mr-2 mb-2 border rounded w-24 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
              min="0"
              max="100"
            />
            <button
              onClick={handleCustomPopularityFilter}
              className="px-4 py-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {popularityFilterText[lang].apply}
            </button>
          </div>
        </div>
      </div>

      {/* 现有的搜索栏 */}
      <p className="mb-2 text-sm text-gray-600">{searchInstructions[lang]}</p>
      <div className="mb-4 flex flex-wrap items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === 'zh' ? "搜索..." : lang === 'en' ? "Search..." : "検索..."}
          className="px-4 py-2 border rounded mr-2 mb-2"
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-4 py-2 border rounded mr-2 mb-2"
        >
          {searchFieldOptions[lang].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {searchButtonText[lang]}
        </button>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {columns[lang].map((column, index) => (
                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {performances && performances.length > 0 ? (
                  performances.map((performance, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{performance[`pername_${langCode}`]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{performance[`location_${langCode}`]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{performance[`place_${langCode}`]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(performance.start_time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(performance.end_time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{performance[`artist_${langCode}`]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{performance.hot_index}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleViewDetails(performance.$id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {lang === 'zh' ? '查看详情' : lang === 'en' ? 'View Details' : '詳細を見る'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                      {lang === 'zh' ? '没有找到数据' : lang === 'en' ? 'No data found' : 'データが見つかりません'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
        >
          {paginationText[lang].prev}
        </button>
        <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
          {paginationText[lang].current} {currentPage} {paginationText[lang].total} {totalPages} {paginationText[lang].pages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
        >
          {paginationText[lang].next}
        </button>
        <input
          type="number"
          value={inputPage}
          onChange={handleInputPageChange}
          className="ml-4 px-2 py-1 w-16 border rounded text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
          min="1"
          max={totalPages}
        />
        <button
          onClick={handleJumpToPage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {paginationText[lang].jump}
        </button>
      </div>
    </div>
  );
}