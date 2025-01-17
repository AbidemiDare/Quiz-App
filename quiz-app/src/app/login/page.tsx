"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../components/loader";

// interface HomeProps {
//   query: string;
//   setQuery : (query : string) => void
// }

const Login = () => {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState("");
  const checkName = query && query.length >= 3;

  const handleSpinner = () => {
    setLoading(true);
    localStorage.setItem("query", query);
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setError("");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Invalid email format");
      } else {
        setError("");
      }
    }
  };

  useEffect(() => {
    const timeLoader = setTimeout(() => {
      setLoad(false);
    }, 1000);

    return () => {
      clearTimeout(timeLoader);
    };
  }, []);

  return (
    <>
      {load ? (
        <Loader />
      ) : (
        <div className="bg-[#F9F9F9] w-full h-screen grid place-items-center grid-cols-1">
          <form className="py-12 px-2">
            <h2 className="pb-8 text-center text-black font-bold text-2xl">
              Hello Friend 😊
            </h2>
            <div className="flex flex-col">
              {/* name input */}
              <div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`rounded-lg w-full py-3 px-4 bg-transparent placeholder-gray-700
                    text-black border-black border border-opacity-25 focus:border-opacity-100 focus:border-green-950 focus:outline-none ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                    required
                  />
                  {query.length < 3 && (
                    <>
                      <p
                        className={`text-xs text-red-500 mt-1 mb-4 ${
                          !query ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Cannot be less than three characters
                      </p>
                    </>
                  )}
                </div>

                {/* username input */}
                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    placeholder="example@gmail.com"
                    className={`py-3 px-4 rounded-lg placeholder-black bg-transparent border border-black border-opacity-20 focus:outline-none ${
                      error
                        ? "border-red-500 focus:border-red-800"
                        : "border-black"
                    }  ${loading ? "opacity-50 cursor-not-allowed" : ""}}`}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  {error && (
                    <p className="text-sm mt-1 mb-4 text-red-500">{error}</p>
                  )}
                </div>
              </div>
              {/* end of inputs field */}

              <Link
                href="/quiz"
                className={`w-full rounded-lg flex justify-center items-center gap-4 font-medium bg-blue-950 text-white py-2 cursor-pointer transition-all duration-500 ease-in-out delay-100 ${
                  checkName && email && !error
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
                onClick={handleSpinner}
              >
                Get started
                {loading && (
                  <div className="h-4 w-4 rounded-full border-white border-b-0 border-2 border-solid animate-spin"></div>
                )}
              </Link>
            </div>
          </form>
          <div className="">
            <p className="text-black">
              {" "}
              <span className="font-bold text-xl">&copy;</span>{" "}
              <span className="text-black font-normal text-xl">
                <b>Abidemi Dare</b>
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
