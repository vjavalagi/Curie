import React, { useState } from "react";
import ProfileIcon from "./ProfileIcon";
import curieLogo from "../assets/curie_no_background.png";
import SearchBar from "./SearchBar";

const Header = () => {
  const [profileImage, setProfileImage] = useState(null); // Track user image

  return (
    <div className="w-full fixed top-0 left-0 h-28 flex items-center justify-between px-8 py-4 bg-curieLightBlue shadow-md z-50">
      <div className="flex items-center">
        <img src={curieLogo} alt="Curie Logo" className="w-32" />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <SearchBar />
      </div>
      <div className="flex items-center">
        <ProfileIcon userImage={profileImage} />
      </div>
    </div>
  );
};

export default Header;