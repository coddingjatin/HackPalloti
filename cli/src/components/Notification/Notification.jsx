import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Notification = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/events/today");
        setEvents(data);
      } catch (error) {
        console.error("Error fetching today's events:", error);
      }
    };

    fetchTodayEvents(); // Initial fetch

    const fetchInterval = setInterval(fetchTodayEvents, 5 * 60 * 1000); // Refresh events every 5 minutes

    const notificationInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      
      events.forEach((event) => {
        const eventTime = new Date(event.start).getTime();
        const diff = eventTime - currentTime;

        if (diff > 0 && diff <= 30 * 60 * 1000) { // 30 minutes before event
          toast.info(`📅 Upcoming Event: ${event.title} in 30 minutes`);
        }
      });
    }, 60000); // Check every minute

    return () => {
      clearInterval(fetchInterval);
      clearInterval(notificationInterval);
    };
  }, [events]); // Update when events change

  return <ToastContainer position="bottom-right" autoClose={5000} />;
};

export default Notification;
