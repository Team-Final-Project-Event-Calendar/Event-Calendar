import { Link } from "react-router-dom";

const linkStyle = {
    textDecoration: "underline",
    color: "#1976d2",
    fontWeight: 500,
    transition: "color 0.2s",
};

const PublicPage = () => (
    <>
    <style>
            {`
                .public-link:hover {
                    color: #0d47a1 !important;
                }
            `}
        </style>
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 400 }}>
                <span style={{ fontWeight: "bold" }}>Welcome to Event Calendar!</span>
            </h1>
            <p>
                We've noticed that you're currently an Anonymous user.
                <br />
                Non-registered users can only view or search for Public Events
                <br />
                If you want to fully experience our Event Calendar,
                <br /> 
                  <Link
                    to="/authentication"
                    style={linkStyle}
                    className="public-link"
                >
                    Log in or Register here!
                </Link>
            </p>
        </div>
    </>
);

export default PublicPage;
