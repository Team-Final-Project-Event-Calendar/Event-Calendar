import { useContext, useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { CustomSpinner } from "../../../pages/PublicPage/PublicPage";

const SharedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { id } = useParams(); // event ID from URL params
  const [isPublicEvent, setIsPublicEvent] = useState(false);
  const [isCheckingEvent, setIsCheckingEvent] = useState(true);

  const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isLoggedIn && id) {
      setIsCheckingEvent(true);

      fetch(`${backendUrl}/api/events/public`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch public events');
          }
          return response.json();
        })
        .then(publicEvents => {
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
      // If user is logged in or no event id, no need to check public events
      setIsCheckingEvent(false);
    }
  }, [isLoggedIn, id, backendUrl]);

  if (loading || isCheckingEvent) {
    return <div><CustomSpinner /></div>;
  }

  if (isLoggedIn || isPublicEvent) {
    return children;
  }

  // Redirect to /public if not authorized
  return <Navigate to="/public" replace />;
};

export default SharedRoute;
