import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SearchSideBar from "../components/SearchSideBar";
import SearchLargeView from "../components/SearchLargeView";
import SearchFilterSidebar from "../components/SearchFilterSidebar";

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />
      {/* Content Layout (Sidebar + MainContent) */}
      <div className="flex flex-1 overflow-hidden">
        <SearchFilterSidebar onFilterSelect={setSelectedFilter} />
        <SearchSideBar selectedFilter={selectedFilter} />
        <SearchLargeView />
      </div>
    </div>
  );
}
