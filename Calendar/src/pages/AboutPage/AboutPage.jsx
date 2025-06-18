import React from "react";
import { Box, Container, Heading, Text, Flex } from "@chakra-ui/react";

import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import {
  SiJavascript,
  SiChakraui,
  SiExpress,
  SiMongodb,
  SiReact,
} from "react-icons/si";

function AboutPage() {
  return (
    <Container
      className="aboutpage-primary-container"
      maxW="5xl"
      py={10}
      border={"1px solid"}
      borderColor="blue.300"
      p={"20px"}
      mt={"40px"}
      borderRadius={"20px"}
      bg="#fbfefb"
    >
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Heading as="h1" size="2xl" mb={4} color="blue.600">
          Imera Calendarium
        </Heading>
        <Text fontSize="lg" color="gray.600" fontStyle="italic">
          From Greek "Imera" (day) and Latin "Calendarium" (calendar)
        </Text>
      </Box>

      {/* Manual Divider */}
      <Box borderBottom="1px solid" borderColor="gray.200" my={4}></Box>

      {/* About The Platform */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4} color="blue.500">
          About Our Platform
        </Heading>
        <Text fontSize="md" lineHeight="1.7">
          Imera Calendarium is a comprehensive event management platform
          designed to help you organize your schedule, create and manage events,
          and connect with others. Whether you're planning personal activities,
          work meetings, or public events, our platform provides the tools you
          need to stay organized and connected.
        </Text>
      </Box>

      {/* Tech Stack */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4} color="blue.500">
          Technology Stack
        </Heading>

        <Flex direction={["column", "column", "row"]} gap={6} mb={4}>
          <Box
            className="aboutpage-techstack-frontend"
            flex="1"
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="blue.200"
          >
            <Heading as="h3" size="md" mb={3}>
              Frontend
            </Heading>
            <ul style={{ paddingLeft: "20px" }}>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaReact /> React
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SiJavascript /> JavaScript
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SiChakraui /> Chakra UI
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SiReact /> React Icons
              </li>
            </ul>
          </Box>

          <Box
            className="aboutpage-techstack-backend"
            flex="1"
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="green.200"
          >
            <Heading as="h3" size="md" mb={3}>
              Backend
            </Heading>
            <ul style={{ paddingLeft: "20px" }}>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SiMongodb /> MongoDB
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaNodeJs /> Node.js
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SiExpress /> Express
              </li>
            </ul>
          </Box>
        </Flex>
      </Box>

      {/* Features */}
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4} color="blue.500">
          Key Features
        </Heading>

        <Flex direction="column" gap={4}>
          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Public & Private Sections
            </Heading>
            <Text>
              Browse public events without an account, or register/login to
              access full platform functionality.
            </Text>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Comprehensive Calendar
            </Heading>
            <Text mb={2}>
              View your events in multiple formats: Monthly, Weekly, Work Week,
              and Daily views with hourly scheduling.
            </Text>
            <Flex gap={2} flexWrap="wrap">
              <span
                style={{
                  background: "#EBF8FF",
                  color: "#3182CE",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  margin: "2px",
                }}
              >
                Monthly
              </span>
              <span
                style={{
                  background: "#E6FFFA",
                  color: "#319795",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  margin: "2px",
                }}
              >
                Weekly
              </span>
              <span
                style={{
                  background: "#F3E8FF",
                  color: "#805AD5",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  margin: "2px",
                }}
              >
                Work Week
              </span>
              <span
                style={{
                  background: "#FFFAF0",
                  color: "#DD6B20",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  margin: "2px",
                }}
              >
                Daily
              </span>
            </Flex>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Event & Series Management
            </Heading>
            <Text>
              Create one-time events or recurring series. Invite others to
              participate, edit details, and manage participants.
            </Text>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Contact Management
            </Heading>
            <Text>
              Add contacts to your list, create specialized contact groups, and
              easily invite them to your events.
            </Text>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              User Preferences
            </Heading>
            <Text>
              Customize your experience including invitation preferences and
              notification settings.
            </Text>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Search Functionality
            </Heading>
            <Text>
              Quickly find events, contacts, and other information with our
              comprehensive search feature.
            </Text>
          </Box>

          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Weather Widget
            </Heading>
            <Text>
              Stay informed about weather day conditions right from our
              navigation bar to better plan your events.
            </Text>
          </Box>
          <Box
            className="aboutpage-boxes-keyfeutures"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="purple.50"
          >
            <Heading as="h3" size="md" mb={2}>
              Admin Panel
            </Heading>
            <Text>
              Administrators can manage users and events from a centralized
              dashboard with powerful search and filtering capabilities.
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Manual Divider */}
      <Box borderBottom="1px solid" borderColor="gray.200" my={4}></Box>

      {/* Team Members */}
      <Box>
        <Heading as="h2" size="lg" mb={6} color="blue.500" textAlign="center">
          Our Team
        </Heading>

        <Flex
          direction={["column", "column", "row"]}
          gap={6}
          justifyContent="center"
        >
          <Box
            textAlign="center"
            bg="green.200"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            flex="1"
            maxW={["100%", "100%", "30%"]}
          >
            <Heading as="h3" size="md" mb={2}>
              Bobi
            </Heading>
            <a
              href="https://github.com/B-D-2409"
              style={{ color: "#3182CE", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </Box>

          <Box
            textAlign="center"
            bg="green.200"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            flex="1"
            maxW={["100%", "100%", "30%"]}
          >
            <Heading as="h3" size="md" mb={2}>
              Ceco
            </Heading>
            <a
              href="https://github.com/TpMarkov"
              style={{ color: "#3182CE", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </Box>

          <Box
            textAlign="center"
            bg="green.200"
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            flex="1"
            maxW={["100%", "100%", "30%"]}
          >
            <Heading as="h3" size="md" mb={2}>
              Simo
            </Heading>
            <a
              href="https://github.com/Ph1los0phy"
              style={{ color: "#3182CE", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}

export default AboutPage;
