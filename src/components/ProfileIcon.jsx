import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import LogoutButton from "../components/LogoutButton";

const ProfileIcon = () => {
  const navigate = useNavigate();
  const { user } = useGlobal();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const userImage = user?.PhotoURL || null;

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleGoToProfile = () => {
    navigate("/profile");
    setDropdownVisible(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

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
    <div ref={dropdownRef} className="hs-dropdown relative inline-flex">
      <button
        onClick={toggleDropdown}
        className="hs-dropdown-toggle w-12 h-12 rounded-full border-2 border-curieBlue overflow-hidden flex items-center justify-center bg-curieLightBlue cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={dropdownVisible}
        title="Profile Options"
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

      {dropdownVisible && (
        <div className="absolute right-0 mt-10 z-10 min-w-40 bg-white shadow-md rounded-lg border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 divide-y divide-gray-200 dark:divide-neutral-700 transition-[opacity,margin] hs-dropdown-open:opacity-100 opacity-100">
          <div className="p-1 space-y-0.5">
            <button
              onClick={handleGoToProfile}
              className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Go to Profile
            </button>

            <div className="w-full py-1">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
