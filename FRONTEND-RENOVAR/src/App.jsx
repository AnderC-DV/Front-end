import React from "react";
import { AppRouter } from "./routes/AppRouter";
import { Toaster } from "sonner";
import NotificationProvider from "./context/NotificationContext"; // Import NotificationProvider

function App() {
  return (
    <NotificationProvider> {/* Wrap AppRouter with NotificationProvider */}
      <AppRouter />
      <Toaster richColors position="top-right" />
    </NotificationProvider>
  );
}

export default App;
