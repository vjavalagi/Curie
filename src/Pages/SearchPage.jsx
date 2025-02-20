import React from "react";
import Header from "../components/Header";
import SearchSideBar from "../components/SearchSideBar";
import SearchLargeView from "../components/SearchLargeView";

export default function SearchPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />
      {/* Content Layout (Sidebar + MainContent) */}
      <div className="flex flex-1  overflow-hidden">
      
        <SearchSideBar/>
        <SearchLargeView />
      </div>
      
    </div>
  );
}
