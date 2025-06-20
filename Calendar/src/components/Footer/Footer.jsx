/**
 * @file Footer.jsx
 * @description A React functional component that renders the footer of the application. 
 * It includes styles for the footer, title, icons, and copyright text.
 */

/**
 * @function Footer
 * @description Renders the footer section of the application with custom styles.
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = () => {
  /**
   * @constant {Object} footerStyle
   * @description Styles for the footer container.
   */
  const footerStyle = {
    marginTop: "auto",
    backgroundColor: "#3f7279",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
  };

  /**
   * @constant {Object} titleStyle
   * @description Styles for the footer title.
   */
  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  /**
   * @constant {Object} iconsContainerStyle
   * @description Styles for the container holding the icons.
   */
  const iconsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    marginBottom: "10px",
  };

  /**
   * @constant {Object} iconStyle
   * @description Styles for individual icons in the footer.
   */
  const iconStyle = {
    width: "38px",
    height: "38px",
    transition: "transform 0.3s",
    cursor: "pointer",
  };

  /**
   * @constant {Object} logoWideStyle
   * @description Styles for wide logos in the footer.
   */
  const logoWideStyle = {
    width: "90px",
    height: "auto",
    objectFit: "contain",
    transition: "transform 0.3s",
    cursor: "pointer",
  };

  /**
   * @constant {Object} copyrightStyle
   * @description Styles for the copyright text in the footer.
   */
  const copyrightStyle = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
  };

  return (
    <footer style={footerStyle}>
      <h2 style={titleStyle}>Built With</h2>

      <div style={iconsContainerStyle}>
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
        © {new Date().getFullYear()} Imera Calendarium. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
