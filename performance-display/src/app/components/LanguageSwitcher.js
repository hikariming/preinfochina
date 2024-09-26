'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const options = [
    { language: "English", code: "en" },
    { language: "中文", code: "zh" },
    { language: "日本語", code: "jp" },
  ];

  const setOption = (option) => {
    router.push(`/${option.code}`);
  };

  return (
    <div className="flex space-x-4">
      {options.map((option, index) => (
        <button
          key={index}
          className={`px-5 py-3 text-base font-medium rounded-lg ${
            pathname === `/${option.code}`
              ? 'bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setOption(option)}
        >
          {option.language}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;