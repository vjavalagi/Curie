import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SearchSideBar from "../components/SearchSideBar";
import SearchLargeView from "../components/SearchLargeView";
import SearchFilterSidebar from "../components/SearchFilterSidebar";
import { searchAPI } from "../backend/Search";
import { useGlobal } from "../components/GlobalContext"; // adjust the path as needed

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useGlobal(); // current search query from global state
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [yearRange, setYearRange] = useState([0, 2025]);
  const [minYear, setMinYear] = useState(0);
  const [maxYear, setMaxYear] = useState(2025);
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleYearRangeChange = (range) => {
    setYearRange(range);
  };

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      // Use the dynamic search query from global state.
      const papers = await searchAPI({ topic: search, limit: 40 });
      setResearchPapers(papers);
      setLoading(false);
      if (papers.length > 0) {
        const years = papers.map((paper) =>
          new Date(paper.published).getFullYear()
        );
        const newMinYear = Math.min(...years);
        const newMaxYear = Math.max(...years);
        setMinYear(newMinYear);
        setMaxYear(newMaxYear);
        setYearRange([newMinYear, newMaxYear]);
      }
    };
    fetchPapers();
  }, [search]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SearchFilterSidebar
          minYear={minYear}
          maxYear={maxYear}
          onYearRangeChange={handleYearRangeChange}
        />
        <SearchSideBar
          selectedFilter={selectedFilter}
          yearRange={yearRange}
          researchPapers={researchPapers}
          loading={loading}
        />
        <SearchLargeView />
      </div>
    </div>
  );
}
