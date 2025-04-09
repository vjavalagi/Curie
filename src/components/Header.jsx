import React from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import curieLogo from "../assets/curie_no_background.png";
import SearchBar from "./SearchBar";
import { useGlobal } from "../context/GlobalContext"; // ✅ import context

const Header = ({ handleSearch }) => {
  const { user } = useGlobal(); // ✅ get user info from context
  const profileImage = user?.PhotoURL || null; // ✅ fallback if no photo

  return (
    <div className="flex flex-row justify-between text-center items-center bg-curieLightBlue">
      <div className="flex justify-center items-center">
        <Link to="/">
          <img src={curieLogo} alt="Curie Logo" className="w-36 pl-8" />
        </Link>
      </div>

      <SearchBar handleSearch={handleSearch} variant="lightblue" />

      <div className="flex justify-center items-center pr-8">
        <ProfileIcon />
      </div>
    </div>
  );
};

export default Header;
