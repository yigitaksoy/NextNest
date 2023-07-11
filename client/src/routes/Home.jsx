import React from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="md:h-auto md:mb-10">
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;
