import React, { useState, useRef } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";
interface DropDownProps {
  username: string | null;
}

const DropDown: React.FC<DropDownProps> = ({ username }) => {
  const supabase = useSupabaseClient();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  function signOut() {
    supabase.auth.signOut().catch((error) => {
      console.error(error);
    });
    router.push("#").catch((error) => {
      console.error(error);
    });
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Adjust the delay as needed (in milliseconds)
  };

  const handleOptionMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleOptionMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <svg
          className="-mr-1 ml-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggleDropdown}
        >
          <path
            fillRule="evenodd"
            d="M10.293 14.293a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div
          className="absolute right-0 mt-4 w-56 origin-top-right  rounded-md  bg-[#19191c] shadow-md shadow-stone-500   ring-1 ring-black ring-opacity-5"
          onMouseEnter={handleOptionMouseEnter}
          onMouseLeave={handleOptionMouseLeave}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-button"
          >
            <Link
              href={`/u/${username as string}`}
              className="text-md block px-4 py-2 text-white hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Profile
            </Link>
            <Link
              href="/setting"
              className="text-md block px-4 py-2 text-white hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Setting
            </Link>
            <div
              className="text-md block px-4 py-2 text-white hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={signOut}
            >
              Sign Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
