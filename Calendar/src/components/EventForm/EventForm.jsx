import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const EventForm = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    type: "",
  });

  const handleChange = (prop, value) => {
    setEvent({ ...event, [prop]: value });
    console.log(typeof event.startDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!event.title || !event.startDate || !event.description) {
        alert("All fields required!");
        return;
      }
      if (event.title.length < 3 || event.title.length > 30) {
        alert(`Title must be betwee 3 - 30 symbols long!`);
        return;
      }
      if (event.description.length > 500) {
        alert("Event description cannot be longer then 500 symbols!");
        return;
      }

      await axios.post("http://localhost:5000/api/events", event, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error(`Error: ${err}`, err.message);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend style={{ color: "black" }}>
            Create New Event
          </Fieldset.Legend>
          <Fieldset.HelperText>
            Please provide your event details below.
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              name="title"
              value={event.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Input
              name="description"
              value={event.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Date</Field.Label>
            <Input
              type="date"
              name="date"
              value={event.date}
              onChange={(e) => handleChange("startDate", e.target.value)}
              backgroundColor="lightpink"
              color="black"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Type</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                name="type"
                value={event.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option
                  style={{ backgroundColor: "transparent" }}
                  value="private"
                >
                  private
                </option>
                <option
                  style={{ backgroundColor: "transparent" }}
                  value="public"
                >
                  public
                </option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          variant="outline"
          color="grey"
          alignSelf="flex-end"
        >
          Create
        </Button>
      </Fieldset.Root>
    </form>
  );
};
export default EventForm;
