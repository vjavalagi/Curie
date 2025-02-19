import React, { useState } from "react";
import "../styles/header.css";
import ProfileIcon from "./ProfileIcon";
import curieLogo from "../assets/curie_no_background.png";

const Header = () => {
  const [profileImage, setProfileImage] = useState(null); // Track user image

  return (
    <div className="header">
      <div className="header-sub">
        {/* <div className="he">Curie, your research aide!</div> */}
        <img src={curieLogo} alt="Curie Logo" className="w-20 mb-8" />
      </div>
      <div className="header-sub">
        <ProfileIcon userImage={profileImage} />
      </div>
    </div>
  );
};

export default Header;
