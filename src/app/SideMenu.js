import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SideMenu = () => {
  const { isLoggedIn, status } = useSelector((state) => state.auth);

  const RenderedElements = () => {
    if (isLoggedIn) {
      if (status === "loading") {
        return <p>Loading Menu...</p>;
      }
      return (
        <div>
          <ul>
            <li>Dashboard</li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>Profile</li>
            <li>Reports</li>
          </ul>
        </div>
      );
    }
    return "";
  };

  return <RenderedElements />;
};

export default SideMenu;
