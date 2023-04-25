import "./App.css";
import RoarForm from "./RoarForm";
import React, { useState } from "react";
import { Flex, Spacer } from "@chakra-ui/react";

// Simple App to present the Input field and produced Notices
function App() {
    const [accountIndex] = useState(0);

    return (
        <div className="App">
            <header className="App-header">
                <Flex>
                    <RoarForm accountIndex={accountIndex} />
                    <Spacer />
                </Flex>
            </header>
        </div>
    );
}

export default App;
