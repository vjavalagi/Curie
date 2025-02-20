import React, { useState } from "react";
import ProfileIcon from "./ProfileIcon";
import curieLogo from "../assets/curie_no_background.png";

const Header = () => {
  const [profileImage, setProfileImage] = useState(null); // Track user image

  return (
    <div className="flex flex-row justify-between items-center text-center bg-curieLightBlue">
      <div className="flex justify-center items-center">
        <img src={curieLogo} alt="Curie Logo" className="w-20 mb-8" />
      </div>
      <div className="flex justify-center items-center">
        <ProfileIcon userImage={profileImage} />
      </div>
    </div>
  );
};

export default Header;