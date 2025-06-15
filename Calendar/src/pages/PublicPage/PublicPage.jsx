import { Link } from "react-router-dom";
import "./PublicPage.css";
import { useState, useEffect } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { Card, Heading, Stack, Box } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL|| "http://localhost:5000";
const PublicPage = () => {
  const [publicEvents, setPublicEvents] = useState([]);

  useEffect(() => {
    fetch(`${key}/api/events/public`)
      .then((res) => res.json())
      .then((data) => setPublicEvents(data))
      .catch((err) => console.error("Failed to fetch public events:", err));
  }, [])


  return (
    <>
      {/* Welcome Text Section */}
      <div className="public-Welcome-container">
        <Stack>
          <Card.Root className="public-welcome-chakra_Card-Root" size="sm">
            <Card.Header>
              <Heading className="public-welcome-chakra_Card-heading" size="lg">
                Welcome to Event Calendar!<hr />
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
          <h2 className="public-events-chakra_Box-title">
            Public Events
          </h2>
            <CardsListComponent 
            className="public-events-chakra_Box-list" 
            events={publicEvents}
            justify="center"
            />
        </Box>
      </div >


    </>
  );
}

export default PublicPage;
