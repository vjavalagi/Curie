
import React, { useState, useEffect } from "react";

const tagColors = [
    { light: "#FFCDD2", dark: "#C62828" }, // Red
    { light: "#F8BBD0", dark: "#AD1457" }, // Pink
    { light: "#E1BEE7", dark: "#6A1B9A" }, // Purple
    { light: "#D1C4E9", dark: "#4527A0" }, // Deep Purple
    { light: "#BBDEFB", dark: "#1565C0" }, // Blue
    { light: "#B3E5FC", dark: "#0277BD" }, // Light Blue
    { light: "#B2EBF2", dark: "#00838F" }, // Cyan
    { light: "#B2DFDB", dark: "#00695C" }, // Teal
    { light: "#C8E6C9", dark: "#2E7D32" }, // Green
    { light: "#DCEDC8", dark: "#558B2F" }, // Light Green
    { light: "#FFF9C4", dark: "#F9A825" }, // Yellow
    { light: "#FFECB3", dark: "#FF8F00" }, // Amber
    { light: "#FFE0B2", dark: "#E65100" }, // Orange
    { light: "#FFCCBC", dark: "#BF360C" }, // Deep Orange
    { light: "#D7CCC8", dark: "#5D4037" }, // Brown
  ];


export default function Card() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
  return (
    <div className="relative">
    <div className="relative flex flex-col h-full bg-white border border-gray-200 group w-80 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">

{/* Dropdown positioned at the top right */}
<div className="absolute z-10 top-2 right-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          type="button"
          className="flex items-center justify-center text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg size-9 shadow-2xs hover:bg-gray-50 focus:outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
          aria-label="Dropdown"
        >
          <svg className="flex-none text-gray-600 size-4 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 w-48 mt-2 transition-opacity duration-200 bg-white rounded-lg shadow-md opacity-100 dark:bg-neutral-800 dark:border dark:border-neutral-700" role="menu" aria-orientation="vertical">
            <div className="p-1 space-y-0.5">
              <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                Newsletter
              </a>
              <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                Purchases
              </a>
              <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                Downloads
              </a>
              <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                Team Account
              </a>
            </div>
          </div>
        )}
      </div>


    <div class="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
        <svg class="size-28" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="10" fill="white"/>
        <path d="M20.2819 26.7478C20.1304 26.5495 19.9068 26.4194 19.6599 26.386C19.4131 26.3527 19.1631 26.4188 18.9647 26.5698C18.848 26.6622 18.7538 26.78 18.6894 26.9144L10.6019 43.1439C10.4874 43.3739 10.4686 43.6401 10.5496 43.884C10.6307 44.1279 10.805 44.3295 11.0342 44.4446C11.1681 44.5126 11.3163 44.5478 11.4664 44.5473H22.7343C22.9148 44.5519 23.0927 44.5037 23.2462 44.4084C23.3998 44.3132 23.5223 44.1751 23.5988 44.011C26.0307 38.9724 24.5566 31.3118 20.2819 26.7478Z" fill="url(#paint0_linear_2204_541)"/>
        <path d="M28.2171 11.9791C26.201 15.0912 25.026 18.6755 24.8074 22.3805C24.5889 26.0854 25.3342 29.7837 26.9704 33.1126L32.403 44.0113C32.4833 44.1724 32.6067 44.3079 32.7593 44.4026C32.912 44.4973 33.088 44.5475 33.2675 44.5476H44.5331C44.6602 44.5479 44.7861 44.523 44.9035 44.4743C45.0209 44.4257 45.1276 44.3543 45.2175 44.2642C45.3073 44.1741 45.3785 44.067 45.427 43.9492C45.4755 43.8314 45.5003 43.7052 45.5 43.5777C45.5001 43.4274 45.4659 43.2791 45.3999 43.1441L29.8619 11.9746C29.7881 11.8184 29.6717 11.6864 29.5261 11.594C29.3805 11.5016 29.2118 11.4525 29.0395 11.4525C28.8672 11.4525 28.6984 11.5016 28.5529 11.594C28.4073 11.6864 28.2908 11.8184 28.2171 11.9746V11.9791Z" fill="#2684FF"/>
        <defs>
        <linearGradient id="paint0_linear_2204_541" x1="24.734" y1="29.2284" x2="16.1543" y2="44.0429" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0052CC"/>
        <stop offset="0.92" stop-color="#2684FF"/>
        </linearGradient>
        </defs>
        </svg>
    </div>




    <div class="p-4 md:p-6">

        <div class="inline-flex flex-wrap gap-2 mb-1.5">
        <div>
        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-curieBlue text-curieLightBlue rounded-full dark:bg-red-500/10 dark:text-red-500">
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            Date
        </span>
        </div>
        </div>


        <h3 class="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
        Paper Title
        </h3>




        <div class="inline-flex flex-wrap gap-2 mb-1.5 mt-3">
        <span class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-curieLightGray text-Black rounded-full">
            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Author
        </span>
        {/* Dynamic for number of Paper Authors */}
        <span class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-curieLightGray text-Black rounded-full">
            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Author 2
        </span>
        </div>

    </div>




    <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
        <a class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
        View sample
        </a>
        <a class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
        View API
        </a>
    </div>
    </div>
    </div>

    );  }