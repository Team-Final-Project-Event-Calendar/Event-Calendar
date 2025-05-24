import React from "react";
import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <NavLink to="/account/authentication"></NavLink>
    </nav>
  );
}

export default Nav;
