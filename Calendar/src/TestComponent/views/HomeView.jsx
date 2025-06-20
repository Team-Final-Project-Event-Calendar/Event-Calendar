/**
 * @file HomeView.jsx
 * @description A React component that serves as the home view of the application. It renders a list of cards using the `CardsListComponent`.
 */

import React from "react";
import CardsListComponent from "../CardsListComponent/CardsListComponent";

/**
 * @function HomeView
 * @description Displays the home view with a list of cards.
 * @returns {JSX.Element} The rendered HomeView component.
 */
function HomeView() {
  return (
    <div>
      <CardsListComponent />
    </div>
  );
}

export default HomeView;