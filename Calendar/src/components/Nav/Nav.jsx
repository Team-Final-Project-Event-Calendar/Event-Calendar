import React from "react";
import { NavLink } from "react-router-dom";
import Authentication from "../Account/Authentication";
function Nav() {
  return (
    <nav>
      <NavLink to="/account/authentication"></NavLink>
    </nav>
  );
}

export default Nav;
