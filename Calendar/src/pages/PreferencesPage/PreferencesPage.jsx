import { useState } from "react";
import { Editable } from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";


function PreferencesPage() {
    const [editCity, setEditCity] = useState("")

    return (
        <>
            <div className="preferences-container">
                <div className="option-globalInvites">
                    <h1>Preferences</h1>
                    <p>Activate Widget, Global to decline all invites for events</p>
                    <Switch.Root>
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                    </Switch.Root>
                    <p>Activate Weather Widget "slide bar turn on/off" - Empty field s place holder "City" + save/edit buton</p>
              
                </div>

                <div className="option-weatherWidget">
                    <h3> Activate Weather Widget </h3>
                    <Switch.Root>
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                    </Switch.Root>
                    <Editable.Root
                        value={editCity}
                        onValueChange={(e) => setEditCity(e.value)}
                        placeholder="Type in your city"
                        autoResize="true"
                        colorPalette="blue"
                        size="md"
                    >
                        <Editable.Preview />
                        <Editable.Input />
                    </Editable.Root>
                </div>
            </div>
        </>
    );
}

export default PreferencesPage;