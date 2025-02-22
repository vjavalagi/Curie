import { useState } from "react";
import curieLogo from "../assets/curie_no_background.png";
import SearchBar from "../components/SearchBar";
import ProfileIcon from "../components/ProfileIcon";

export default function LandingPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-curieLightGray">
      <img src={curieLogo} alt="Curie Logo" className="w-48 mb-8" />
      <SearchBar variant="lightgray" />
      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        <a href="#" className="hover:underline px-2">
          Privacy
        </a>{" "}
        |
        <a href="#" className="hover:underline px-2">
          Terms
        </a>
      </footer>
    </div>
  );
}