const Footer = () => {
  const footerStyle = {
    marginTop: "50px",
    backgroundColor: "#3f7279",
    color: "white",
    padding: "20px 20px",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
  };

  const iconsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px",
  };

  const iconStyle = {
    width: "48px",
    height: "48px",
    transition: "transform 0.3s",
    cursor: "pointer",
  };

  const logoWideStyle = {
    width: "90px",
    height: "auto",
    objectFit: "contain",
    transition: "transform 0.3s",
    cursor: "pointer",
  };

  const copyrightStyle = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
  };

  return (
    <footer style={footerStyle}>
      <h2 style={titleStyle}>Built With</h2>

      <div style={iconsContainerStyle}>
        {/* React */}
        <a
          href="https://react.dev/"
          target="_blank"
          rel="noopener noreferrer"
          title="React"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
            style={iconStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </a>

        {/* JavaScript */}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          target="_blank"
          rel="noopener noreferrer"
          title="JavaScript"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
            alt="JavaScript Logo"
            style={iconStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </a>

        {/* MongoDB */}
        <a
          href="https://www.mongodb.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="MongoDB"
        >
          <img
            src="https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png"
            alt="MongoDB Logo"
            style={logoWideStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </a>

        {/* Express */}
        <a
          href="https://expressjs.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Express"
        >
          <img
            src="https://qualitapps.com/wp-content/uploads/2023/02/102.png"
            alt="Express Logo"
            style={logoWideStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </a>
      </div>

      <p style={copyrightStyle}>
        © {new Date().getFullYear()} Your Project Name. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
