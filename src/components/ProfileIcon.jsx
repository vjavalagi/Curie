import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

const ProfileIcon = () => {
  const navigate = useNavigate();
  const { user } = useGlobal();
  const userImage = user?.PhotoURL || null;

  const handleClick = () => {
    navigate("/profile");
  };

  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="size-6 w-8 h-8 text-curieBlue"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      className="w-12 h-12 rounded-full border-2 border-curieBlue overflow-hidden flex items-center justify-center bg-curieLightBlue cursor-pointer"
      title="Go to profile"
    >
      {userImage ? (
        <img
          src={userImage}
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        defaultIcon
      )}
    </button>
  );
};

export default ProfileIcon;
