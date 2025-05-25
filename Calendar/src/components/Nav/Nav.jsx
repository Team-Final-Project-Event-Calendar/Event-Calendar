import React from "react";
import { NavLink } from "react-router-dom";
import Authentication from "../Account/Authentication";
import "./Nav.css";

function Nav() {
  return (
    <nav>
      <NavLink to="/account/authentication"></NavLink>
    </nav>
  );
}

export default Nav;
