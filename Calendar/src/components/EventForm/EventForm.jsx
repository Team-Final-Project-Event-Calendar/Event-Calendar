import {
  Button,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Authentication/AuthContext";
const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const EventForm = ({ onEventCreated }) => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    type: "",
    startDateTime: "",
    endDateTime: "",
    isRecurring: false,
    isLocation: false,
    participants: [],
    location: {
      address: "",
      city: "",
      country: "",
    },
    recurrenceRule: {
      frequency: "",
      interval: 1,
      endDate: "",
    },
  });

  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [participantName, setParticipantName] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${key}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const addParticipant = () => {
    const trimmedName = participantName.trim();
    if (trimmedName) {
      setEvent((prev) => ({
        ...prev,
        participants: [...prev.participants, trimmedName],
      }));
      setParticipantName("");
    }
  };

  const removeParticipant = (index) => {
    setEvent((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...event.participants];
    newParticipants[index] = value;
    setEvent((prev) => ({
      ...prev,
      participants: newParticipants,
    }));

    if (errors.participants) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        participants: "",
      }));
    }
  };

  const handleChange = (prop, value) => {
    setEvent({ ...event, [prop]: value });
    setErrors({ ...errors, [prop]: "" });
  };

  const handleLocationChange = (field, value) => {
    setEvent({
      ...event,
      location: {
        ...event.location,
        [field]: value,
      },
    });

    if (errors.location) {
      setErrors({
        ...errors,
        location: {
          ...errors.location,
          [field]: "",
        },
      });
    }
  };

  const handleRecurrenceChange = (key, value) => {
    setEvent({
      ...event,
      recurrenceRule: {
        ...event.recurrenceRule,
        [key]: value,
      },
    });
    setErrors({
      ...errors,
      recurrenceRule: { ...errors.recurrenceRule, [key]: "" },
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!event.title || event.title.length < 3 || event.title.length > 30) {
      newErrors.title = "Title must be between 3 and 30 characters.";
    }

    if (
      !event.description ||
      event.description.length < 10 ||
      event.description.length > 500
    ) {
      newErrors.description =
        "Description must be between 10 and 500 characters.";
    }

    if (!event.type) {
      newErrors.type = "Please select a type.";
    }

    if (!event.startDateTime) {
      newErrors.startDateTime = "Start date and time is required.";
    }

    if (!event.endDateTime) {
      newErrors.endDateTime = "End date and time is required.";
    }

    const locErrors = {};
    const { address, city, country } = event.location;

    if (address && (address.length < 5 || address.length > 100)) {
      locErrors.address = "Address must be between 5 and 100 characters.";
    }

    if (city && (city.length < 2 || city.length > 50)) {
      locErrors.city = "City must be between 2 and 50 characters.";
    }

    if (country && (country.length < 2 || country.length > 50)) {
      locErrors.country = "Country must be between 2 and 50 characters.";
    }

    if (Object.keys(locErrors).length > 0) {
      newErrors.location = locErrors;
    }

    if (event.isRecurring) {
      const recurrenceErrors = {};
      if (!event.recurrenceRule.frequency) {
        recurrenceErrors.frequency =
          "Frequency is required for recurring events.";
      }

      if (!event.recurrenceRule.interval || event.recurrenceRule.interval < 1) {
        recurrenceErrors.interval = "Interval must be at least 1.";
      }

      if (Object.keys(recurrenceErrors).length > 0) {
        newErrors.recurrenceRule = recurrenceErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    const preparedEvent = { ...event };
    if (!preparedEvent.isRecurring) {
      delete preparedEvent.recurrenceRule;
    } else {
      if (
        !["daily", "weekly", "monthly"].includes(
          preparedEvent.recurrenceRule.frequency
        )
      ) {
        preparedEvent.recurrenceRule.frequency = undefined;
      }
      if (!preparedEvent.recurrenceRule.endDate) {
        delete preparedEvent.recurrenceRule.endDate;
      } else {
        preparedEvent.recurrenceRule.endDate = new Date(
          preparedEvent.recurrenceRule.endDate
        );
      }
    }

    try {
      const res = await axios.post(`${key}/api/events`, preparedEvent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      const createdEvent = res.data;
      setSuccessMessage("✅ Event created successfully!");
      setEvent({
        title: "",
        description: "",
        type: "",
        startDateTime: "",
        endDateTime: "",
        isRecurring: false,
        isLocation: false,
        participants: [],
        location: {
          address: "",
          city: "",
          country: "",
        },
        recurrenceRule: {
          frequency: "",
          interval: 1,
          endDate: "",
        },
      });
      setErrors({});
      if (onEventCreated) onEventCreated(createdEvent);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Failed to create event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: "350px" }}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend style={{ color: "black" }}>
            Create New Event
          </Fieldset.Legend>
        </Stack>

        {successMessage && (
          <Text
            color={successMessage.startsWith("✅") ? "green.500" : "red.500"}
          >
            {successMessage}
          </Text>
        )}

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              value={event.title}
              onChange={(e) => handleChange("title", e.target.value)}
              isInvalid={!!errors.title}
            />
            {errors.title && <Text color="red.500">{errors.title}</Text>}
          </Field.Root>

          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              value={event.description}
              onChange={(e) => handleChange("description", e.target.value)}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>Add Location</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={event.isLocation ? "yes" : "no"}
                onChange={(e) =>
                  handleChange("isLocation", e.target.value === "yes")
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {event.isLocation && (
            <>
              <Field.Root>
                <Field.Label>Address</Field.Label>
                <Input
                  value={event.location.address}
                  onChange={(e) =>
                    handleLocationChange("address", e.target.value)
                  }
                  isInvalid={!!errors.location?.address}
                />
                {errors.location?.address && (
                  <Text color="red.500">{errors.location.address}</Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>City</Field.Label>
                <Input
                  value={event.location.city}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                  isInvalid={!!errors.location?.city}
                />
                {errors.location?.city && (
                  <Text color="red.500">{errors.location.city}</Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Country</Field.Label>
                <Input
                  value={event.location.country}
                  onChange={(e) =>
                    handleLocationChange("country", e.target.value)
                  }
                  isInvalid={!!errors.location?.country}
                />
                {errors.location?.country && (
                  <Text color="red.500">{errors.location.country}</Text>
                )}
              </Field.Root>
            </>
          )}

          <Field.Root>
            <Field.Label>Participants</Field.Label>
            <Stack direction="row" spacing={2} mb={2}>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {users
                    .filter((u) => u._id !== user?._id)
                    .map((u) => (
                      <option key={u._id} value={u.username}>
                        {u.username}
                      </option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Button onClick={addParticipant} size="sm" variant="outline">
                + Add
              </Button>
            </Stack>

            {event.participants.map((participant, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                align="center"
                mb={2}
              >
                <Input
                  value={participant}
                  onChange={(e) =>
                    handleParticipantChange(index, e.target.value)
                  }
                  isInvalid={!!errors.participants}
                />
                <Button
                  colorScheme="red"
                  onClick={() => removeParticipant(index)}
                  size="sm"
                >
                  Remove
                </Button>
              </Stack>
            ))}

            {errors.participants && (
              <Text color="red.500" mt={1}>
                {errors.participants}
              </Text>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>Type</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={event.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="">Select type</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            {errors.type && <Text color="red.500">{errors.type}</Text>}
          </Field.Root>

          <Field.Root>
            <Field.Label>Start Date & Time</Field.Label>
            <Input
              backgroundColor="lightpink"
              type="datetime-local"
              value={event.startDateTime}
              onChange={(e) => handleChange("startDateTime", e.target.value)}
              isInvalid={!!errors.startDateTime}
            />
            {errors.startDateTime && (
              <Text color="red.500">{errors.startDateTime}</Text>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>End Date & Time</Field.Label>
            <Input
              backgroundColor="lightpink"
              type="datetime-local"
              value={event.endDateTime}
              onChange={(e) => handleChange("endDateTime", e.target.value)}
              isInvalid={!!errors.endDateTime}
            />
            {errors.endDateTime && (
              <Text color="red.500">{errors.endDateTime}</Text>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>Add Recurring</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={event.isRecurring ? "yes" : "no"}
                onChange={(e) =>
                  handleChange("isRecurring", e.target.value === "yes")
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {event.isRecurring && (
            <>
              <Field.Root>
                <Field.Label>Frequency</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={event.recurrenceRule.frequency}
                    onChange={(e) =>
                      handleRecurrenceChange("frequency", e.target.value)
                    }
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                {errors.recurrenceRule?.frequency && (
                  <Text color="red.500">{errors.recurrenceRule.frequency}</Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  Interval (e.g. every X days/weeks/months)
                </Field.Label>
                <Input
                  type="number"
                  min={1}
                  value={event.recurrenceRule.interval}
                  onChange={(e) =>
                    handleRecurrenceChange("interval", Number(e.target.value))
                  }
                  isInvalid={!!errors.recurrenceRule?.interval}
                />
                {errors.recurrenceRule?.interval && (
                  <Text color="red.500">{errors.recurrenceRule.interval}</Text>
                )}
              </Field.Root>
            </>
          )}
        </Fieldset.Content>

        <Button
          type="submit"
          variant="outline"
          bg="green.500"
          color="white"
          size="lg"
          mt={4}
          _hover={{ bg: "green.900" }}
          _active={{ bg: "green.900" }}
        >
          Create
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default EventForm;
