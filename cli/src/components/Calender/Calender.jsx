import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form } from "react-bootstrap";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events",{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(response);
      const data = await response.json();

    
      setEvents(data?.map(event => ({
        ...event,
        start: moment(event.start).toDate(),
        end: moment(event.end).toDate()
      })));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end });
    setShowModal(true);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) return;
    try {
      if(selectedEvent){
        const response = await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newEvent)
        });

        const data = await response.json();

      } else {
        const response = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newEvent)
        });
        const data = await response.json();
        console.log(data);
      }
      
      setShowModal(false);
      /* setEvents([...events, data]); */
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchEvents();
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Goal Calendar</h4>
        </div>
        <div className="card-body">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            style={{ height: 500, width: 1000, paddingTop: 0 }}
            className="border rounded w-100"
          />
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? "Edit Goal" : "Add Goal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Goal Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Today's Goal..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.start ? moment(newEvent.start).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.end ? moment(newEvent.end).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            {selectedEvent ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCalendar;
