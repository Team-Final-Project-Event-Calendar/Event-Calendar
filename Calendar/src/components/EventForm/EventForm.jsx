import {
  Button,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const EventForm = ({ onEventCreated }) => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    type: "",
    startDateTime: "",
    endDateTime: "",
    isRecurring: false,
    recurrenceRule: {
      frequency: "",
      interval: 1,
      endDate: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (prop, value) => {
    setEvent({ ...event, [prop]: value });
    setErrors({ ...errors, [prop]: "" });
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

    if (event.isRecurring) {
      const recurrenceErrors = {};
      if (!event.recurrenceRule.frequency) {
        recurrenceErrors.frequency =
          "Frequency is required for recurring events.";
      }
      if (!event.recurrenceRule.endDate) {
        recurrenceErrors.endDate = "End date is required for recurring events.";
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

    if (!event.isRecurring) {
      delete event.recurrenceRule;
    } else {
      if (
        !["daily", "weekly", "monthly"].includes(event.recurrenceRule.frequency)
      ) {
        event.recurrenceRule.frequency = undefined;
      }
      if (!event.recurrenceRule.endDate) {
        delete event.recurrenceRule.endDate;
      } else {
        event.recurrenceRule.endDate = new Date(event.recurrenceRule.endDate);
      }
    }
    try {
      const res = await axios.post("http://localhost:5000/api/events", event, {
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
    <form onSubmit={handleSubmit}>
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
            <Input
              value={event.description}
              onChange={(e) => handleChange("description", e.target.value)}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
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
            <Field.Label>Is Recurring?</Field.Label>
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
                <Field.Label>Interval</Field.Label>
                <Input
                  type="number"
                  min={1}
                  value={event.recurrenceRule.interval}
                  onChange={(e) =>
                    handleRecurrenceChange("interval", e.target.value)
                  }
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Recurrence End Date</Field.Label>
                <Input
                  type="date"
                  value={event.recurrenceRule.endDate}
                  onChange={(e) =>
                    handleRecurrenceChange("endDate", e.target.value)
                  }
                />
                {errors.recurrenceRule?.endDate && (
                  <Text color="red.500">{errors.recurrenceRule.endDate}</Text>
                )}
              </Field.Root>
            </>
          )}
        </Fieldset.Content>

        <Button
          type="submit"
          variant="outline"
          color="gray"
          alignSelf="flex-end"
        >
          Create
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default EventForm;
