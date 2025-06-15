import { Link } from "react-router-dom";
import "./PublicPage.css";
import { useState, useEffect } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { Card, Heading, Stack, Box } from "@chakra-ui/react";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { IconContext } from "react-icons";
import { Spinner } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const CustomSpinner = () => (
  <div style={{ textAlign: "center", padding: "50px 0" }}>
    <Spinner
      color="red.500"
      size="xl"
      animationDuration="0.8"
      borderWidth="20px"
      padding="2vw"
      margin= "0px 565px 123px"
      />

    <p style={{ color: "white", fontSize:"30px" }}>Loading...</p>
  </div>
);


const PublicPage = () => {
  const [publicEvents, setPublicEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 6;


  useEffect(() => {
    setLoading(true); //dobavi spinner za ui friendliness, dokat zarejda
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

  // Calculate total pages
  const totalPages = Math.ceil(publicEvents.length / eventsPerPage);

  // Get current events for display
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = publicEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {/* Welcome Text Section */}
      <div className="public-Welcome-container">
        <Stack>
          <Card.Root className="public-welcome-chakra_Card-Root" size="sm">
            <Card.Header>
              <Heading className="public-welcome-chakra_Card-heading" size="lg">
                Welcome to Event Calendar!
                <hr />
              </Heading>
            </Card.Header>
            <Card.Body className="public-welcome-chakra_Card-Body">
              <p>
                We've noticed that you're currently an Anonymous user.
                <br />
                Non-registered users can only view or search for Public Events
                <br />
                If you want to fully experience our Event Calendar,
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
          <h2 className="public-events-chakra_Box-title">Public Events</h2>

          <IconContext.Provider value={{ size: "5em" }}>
            <div
              className="arrows-cardlist-container"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0px 50px",
              }}
            >
              <div
                onClick={handlePrevPage}
                style={{
                  cursor: currentPage > 1 ? "pointer" : "not-allowed",
                  opacity: currentPage > 1 ? 1 : 0.5,
                }}
              >
                <MdArrowBackIos />
              </div>
              <div style={{ flex: 1 }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "50px 0" }}>
                    <CustomSpinner />
                  </div>
                ) : (
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
    </>
  );
};

export default PublicPage;
