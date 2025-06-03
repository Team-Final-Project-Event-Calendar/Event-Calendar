import { Link } from "react-router-dom";
import "./PublicPage.css";
import { useState, useEffect } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { Card, Heading, Stack } from "@chakra-ui/react";


const PublicPage = () => {
  const [publicEvents, setPublicEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events/public")
      .then((res) => res.json())
      .then((data) => setPublicEvents(data))
      .catch((err) => console.error("Failed to fetch public events:", err));
  }, [])


  return (
    <>
      {/* Welcome Text Section */}
      <div className="public-WelcomeText"
        style={{ alignContent: "center", display: "flex", justifyContent: "center" }}>
        <Stack style={{}}>
          <Card.Root size="sm" backgroundColor="#F5F5F5" borderRadius="40px" borderColor="#E5E4E2" textAlign="center">
            <Card.Header>
              <Heading size="lg" fontSize="25px" color="black" fontWeight="bold">
                Welcome to Event Calendar!
                 <hr/>
              </Heading>
            </Card.Header>
            <Card.Body color="black" padding={3}>
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
      <div className="public-Events" style={{ margin: "2rem auto", maxWidth: "1100px" }}>
        <h2 style={{ textAlign: "center", color: "green", fontSize: 25 }}>Public Events</h2>
        <CardsListComponent events={publicEvents} />
      </div>

    </>
  );
}

export default PublicPage;
