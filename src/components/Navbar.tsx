import React, { useState } from "react";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      router.push(`/search/${searchValue.trim()}`);
    }
  };

  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
  };
  return (
    <div className="flex flex-row bg-[#19191c]  py-2 lg:px-40">
      <div className=" basis-1/4">
        <a href="/">
          <img src="/awesome_logo.png" alt="logo" width={50} />
        </a>
      </div>
      <div className="  my-auto basis-2/4">
        <input
          type="text"
          name=""
          id=""
          value={searchValue}
          onChange={handleChange}
          className="w-3/4 rounded-lg p-3"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className=" flex basis-1/4 flex-row items-center justify-center">
        <a href="/login">
          <button className="button mr-4 rounded-lg bg-green-400 px-8 py-2 font-bold">
            Login
          </button>
        </a>
      </div>
    </div>
  );
}
