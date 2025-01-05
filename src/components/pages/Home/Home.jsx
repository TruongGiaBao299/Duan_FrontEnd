import React, { useState, useEffect } from "react";
import Header from "../../layout/Header/Header";
import CreateOrder from "./CreateOrder/CreateOrder";
import FindOrder from "./FindOrder/FindOrder";
import PostOffice from "./PostOffice/PostOffice";
import BecomeDriver from "./BecomeDriver/BecomeDriver";
import SearchPrice from "./SearchPrice/SearchPrice";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("create"); // State to track current page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in

  useEffect(() => {
    // Check for token in localStorage to determine if the user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if there's a token, otherwise false
  }, []);

  return (
    <>
      <Header />
      <div>
        {/* Page navigation buttons */}
        <button onClick={() => setCurrentPage("create")}>Create Order</button>
        <button onClick={() => setCurrentPage("find")}>Find Order</button>
        <button onClick={() => setCurrentPage("postoffice")}>PostOffice</button>
        <button onClick={() => setCurrentPage("searchprice")}>SearchPrice</button>
        
        {/* Only show BecomeDriver button if the user is logged in */}
        {isLoggedIn && (
          <button onClick={() => setCurrentPage("becomedriver")}>
            Become Driver
          </button>
        )}
      </div>

      {/* Display components based on the current page */}
      {currentPage === "create" && <CreateOrder />}
      {currentPage === "find" && <FindOrder />}
      {currentPage === "postoffice" && <PostOffice />}
      {currentPage === "searchprice" && <SearchPrice />}
      {currentPage === "becomedriver" && isLoggedIn && <BecomeDriver />}
    </>
  );
};

export default Home;
