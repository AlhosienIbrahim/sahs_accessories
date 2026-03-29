import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    var user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  function logout() {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    }).then(function () {
      localStorage.removeItem("username");
      setUsername("");
      navigate("/");
    });
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fa-solid fa-headphones fa-xl"></i> Sahs Accessories
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#myNavbar"
          aria-controls="myNavbar"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="myNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link btn btn-dark text-light px-3 ms-lg-2 mt-2 mt-lg-0"
                to="/cart"
              >
                <i className="fa-solid fa-cart-shopping"></i> Cart
              </Link>
            </li>

            {username ? (
              <>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <span className="nav-link text-light">Hi, {username}</span>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
