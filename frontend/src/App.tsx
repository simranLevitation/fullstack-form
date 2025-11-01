import React from "react";
import { MultiStepForm } from "./components/MultiStepForm";

export const App: React.FC = () => {
    return (
        <div style={{ padding: 16 }}>
            <h2>User Detail</h2>
            <MultiStepForm />
        </div>
    );
};

export default App;
