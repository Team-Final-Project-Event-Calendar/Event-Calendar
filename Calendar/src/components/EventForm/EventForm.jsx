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

    if (!event.title || !event.date || !event.description) {
      alert(`All fields are required!`);
      return;
    }
    // await axios.post("http://localhost:5000/api/events");
    console.log(event);
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

        <Button type="submit" alignSelf="flex-start">
          Create
        </Button>
      </Fieldset.Root>
    </form>
  );
};
export default EventForm;
