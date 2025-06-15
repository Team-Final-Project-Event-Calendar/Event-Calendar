import { useContext, useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Spinner } from "@chakra-ui/react";
import { CustomSpinner }  from "../../../pages/PublicPage/PublicPage";

const SharedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { id } = useParams(); // Get the event ID from URL
  const [isPublicEvent, setIsPublicEvent] = useState(false);
  const [isCheckingEvent, setIsCheckingEvent] = useState(true);

  const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:5000';

  useEffect(() => {
    // Only check if this is a public event for non-logged in users
    if (!isLoggedIn && id) {
      setIsCheckingEvent(true);
      
      // Use an existing endpoint - fetch all public events and check if our ID is in there
      fetch(`${backendUrl}/api/events/public`)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch public events');
        })
        .then(publicEvents => {
          // Check if this event ID exists in the public events
          const isPublic = publicEvents.some(event => event._id === id);
          setIsPublicEvent(isPublic);
        })
        .catch(err => {
          console.error("Error checking public events:", err);
          setIsPublicEvent(false);
        })
        .finally(() => {
          setIsCheckingEvent(false);
        });
    } else {
      // Logged in users can see all events they have access to
      setIsCheckingEvent(false);
    }
  }, [isLoggedIn, id, backendUrl]);

  if (loading || isCheckingEvent) {
    return <div><CustomSpinner/></div>;
  }

  // Allow access if:
  // 1. User is logged in, OR
  // 2. User is not logged in BUT the event is public
  if (isLoggedIn || isPublicEvent) {
    return children;
  }

  // If event is not public and user is not logged in, redirect to public page
  return <Navigate to="/public" replace />;
};

export default SharedRoute;