// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { TourProvider } from "./context/TourContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <BookingProvider>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </BookingProvider>
      </TourProvider>
    </AuthProvider>
  );
}

export default App;
