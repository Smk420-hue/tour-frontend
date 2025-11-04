import { createContext, useContext, useEffect, useState } from "react";
import { getAllTours, getTourById } from "../api/tourApi";

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTours = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllTours(filters);
      setTours(data.tours || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTourById = async (id) => {
    try {
      setLoading(true);
      const data = await getTourById(id);
      setSelectedTour(data.tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <TourContext.Provider
      value={{
        tours,
        selectedTour,
        loading,
        fetchTours,
        fetchTourById,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTourContext = () => useContext(TourContext);
