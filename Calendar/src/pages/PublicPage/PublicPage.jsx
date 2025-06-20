/**
 * @file PublicPage.jsx
 * @description A React component that displays a paginated list of public events. It supports search functionality and integrates with global search events.
 */

import { Link, useLocation } from "react-router-dom";
import "./PublicPage.css";
import { useState, useEffect } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { Card, Heading, Stack, Box, Button } from "@chakra-ui/react";
import { MdArrowForwardIos, MdArrowBackIosNew, MdInfoOutline } from "react-icons/md";
import { IconContext } from "react-icons";
import { Spinner } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function CustomSpinner
 * @description A custom spinner component for loading states.
 * @returns {JSX.Element} The rendered spinner component.
 */
export const CustomSpinner = () => (
  <div style={{ textAlign: "center", padding: "50px 0" }}>
    <Spinner
      color="#5565DD"
      size="xl"
      animationDuration="0.8"
      borderWidth="20px"
      padding="2vw"
      margin="0px 565px 123px"
    />
    <p style={{ color: "#666", fontSize: "30px" }}>Loading...</p>
  </div>
);

/**
 * @function PublicPage
 * @description Displays a list of public events with pagination and search functionality.
 * @returns {JSX.Element} The rendered PublicPage component.
 */
const PublicPage = () => {
  /**
   * @constant {Array<Object>} publicEvents
   * @description The list of public events fetched from the backend.
   */
  const [publicEvents, setPublicEvents] = useState([]);

  /**
   * @constant {number} currentPage
   * @description The current page number for pagination.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * @constant {boolean} loading
   * @description Indicates whether the public events are being loaded.
   */
  const [loading, setLoading] = useState(true);

  /**
   * @constant {Array<Object>|null} searchResults
   * @description The list of events matching the search query. If `null`, all public events are displayed.
   */
  const [searchResults, setSearchResults] = useState(null);

  /**
   * @constant {string} searchTerm
   * @description The current search term entered by the user.
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * @constant {number} eventsPerPage
   * @description The number of events displayed per page.
   */
  const eventsPerPage = 6;

  /**
   * @constant {Object} location
   * @description The current location object from React Router.
   */
  const location = useLocation();

  /**
   * @function useEffect
   * @description Handles search results passed via navigation state and clears the state after processing.
   */
  useEffect(() => {
    if (location.state?.searchResults && location.state?.searchTerm) {
      setSearchResults(location.state.searchResults);
      setSearchTerm(location.state.searchTerm);
      setCurrentPage(1);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /**
   * @function useEffect
   * @description Listens for global search and clear search events from the navigation component.
   */
  useEffect(() => {
    const handleGlobalSearch = (event) => {
      const { results, term } = event.detail;
      setSearchResults(results);
      setSearchTerm(term);
      setCurrentPage(1);
    };

    const handleGlobalClearSearch = () => {
      setSearchResults(null);
      setSearchTerm("");
      setCurrentPage(1);
    };

    window.addEventListener("homepageSearch", handleGlobalSearch);
    window.addEventListener("homepageClearSearch", handleGlobalClearSearch);

    return () => {
      window.removeEventListener("homepageSearch", handleGlobalSearch);
      window.removeEventListener("homepageClearSearch", handleGlobalClearSearch);
    };
  }, []);

  /**
   * @function useEffect
   * @description Fetches the list of public events from the backend when the component mounts.
   */
  useEffect(() => {
    setLoading(true);
    fetch(`${key}/api/events/public`)
      .then((res) => res.json())
      .then((data) => {
        setPublicEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch public events:", err);
        setLoading(false);
      });
  }, []);

  /**
   * @constant {Array<Object>} eventsToProcess
   * @description The list of events to display, either search results or all public events.
   */
  const eventsToProcess = searchResults !== null ? searchResults : publicEvents;

  /**
   * @constant {number} totalPages
   * @description The total number of pages for pagination.
   */
  const totalPages = Math.ceil(eventsToProcess.length / eventsPerPage);

  /**
   * @constant {Array<Object>} currentEvents
   * @description The list of events to display on the current page.
   */
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventsToProcess.slice(indexOfFirstEvent, indexOfLastEvent);

  /**
   * @function handlePrevPage
   * @description Navigates to the previous page in the pagination.
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * @function handleNextPage
   * @description Navigates to the next page in the pagination.
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * @function clearSearch
   * @description Clears the search results and resets the pagination to the first page.
   */
  const clearSearch = () => {
    setSearchResults(null);
    setSearchTerm("");
    setCurrentPage(1);
    window.dispatchEvent(new CustomEvent("clearNavSearch"));
  };

  return (
    <>
      {/* Welcome Text Section */}
      <div className="public-Welcome-container">
        <Stack>
          <Card.Root className="public-welcome-chakra_Card-Root" size="sm">
            <Card.Header>
              <Heading className="public-welcome-chakra_Card-heading" size="lg">
                Welcome to Imera Calendarium!
                <hr />
              </Heading>
            </Card.Header>
            <Card.Body className="public-welcome-chakra_Card-Body">
              <p>
                We've noticed that you're currently an Anonymous user.
                <br />
                Non-registered users can only view or search for Public Events
                <br />
                If you want to fully experience our Imera Calendar,
                <br />
                <Link to="/authentication" className="public-link">
                  Log in or Register here!
                </Link>
              </p>
            </Card.Body>
          </Card.Root>
        </Stack>
      </div>

      {/* Public Events Section */}
      <div className="public-Events-container">
        <Box className="public-events-chakra_Box" borderRadius="xl">
          {/* Display title based on whether showing search results or all public events */}
          <h2 className="public-events-chakra_Box-title">
            {searchResults !== null ? `Search Results for "${searchTerm}"` : "Public Events"}
            {searchResults !== null && (
              <button
                onClick={clearSearch}
                style={{
                  marginLeft: "3rem",
                  marginBottom: "4px",
                  background: "#DC2626",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Clear Search
              </button>
            )}
          </h2>

          <IconContext.Provider value={{ size: "5em" }}>
            <div
              className="arrows-cardlist-container"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0px 35px",
              }}
            >
              <div
                onClick={handlePrevPage}
                style={{
                  cursor: currentPage > 1 ? "pointer" : "not-allowed",
                  opacity: currentPage > 1 ? 1 : 0.5,
                }}
              >
                <MdArrowBackIosNew />
              </div>
              <div style={{ flex: 1 }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <CustomSpinner />
                  </div>
                ) : currentEvents.length > 0 ? (
                  <>
                    <CardsListComponent
                      className="public-events-chakra_Box-list"
                      events={currentEvents}
                      justify="center"
                      maxWidth="1400px"
                    />

                    <div style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontSize: "1rem",
                      color: "#666"
                    }}>
                      Page {currentPage} of {totalPages || 1}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "50px 0", color: "#666" }}>
                    {searchResults !== null
                      ? `No events found matching "${searchTerm}"`
                      : "No public events available"}
                  </div>
                )}
              </div>

              <div
                onClick={handleNextPage}
                style={{
                  cursor: currentPage < totalPages ? "pointer" : "not-allowed",
                  opacity: currentPage < totalPages ? 1 : 0.5,
                }}
              >
                <MdArrowForwardIos />
              </div>
            </div>
          </IconContext.Provider>
        </Box>
      </div>
      {/* About Page Button */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        margin: "40px 0 60px 0"
      }}>
        <Button
          as={Link}
          to="/about"
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          bgColor="#5565DD"
          color="white"
          _hover={{ bgColor: "#4455CC" }}
          boxShadow="0 4px 6px rgba(85, 101, 221, 0.3)"
          padding="25px 40px"
          fontSize="18px"
        >
          <MdInfoOutline /> Learn More About Imera Calendarium
        </Button>
      </div>
    </>
  );
};

export default PublicPage;
