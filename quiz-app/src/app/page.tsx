"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "./components/loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-[#f9f9f9] grid place-items-center w-full h-screen">
          <div>
            <h1 className="font-bold text-4xl text-center text-black pb-6">
              Quiz App
            </h1>

            <div className="grid place-items-center">
              <Link
                href="/login"
                className="bg-yellow-950 text-base text-white py-4 px-6 flex items-center duration-100 transition-all text-center lg:hover:bg-yellow-800"
              >
                Next{" "}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-chevron-right text-xs"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>{" "}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
