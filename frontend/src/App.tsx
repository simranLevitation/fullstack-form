import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { MultiStepForm } from "./components/MultiStepForm";
import { FormsList } from "./components/FormsList";

export const App: React.FC = () => {
    return (
        <Router>
            <div style={{ padding: 16 }}>


                <Routes>
                    {/* Default redirect to /form */}
                    <Route path="/" element={<Navigate to="/form" replace />} />
                    <Route path="/form" element={<MultiStepForm />} />
                    <Route path="/submissions" element={<FormsList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
