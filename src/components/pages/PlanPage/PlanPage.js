import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  createTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import "./PlanPage.css"; // นำเข้าไฟล์ CSS เพื่อจัดการกับสไตล์
import * as scheduleActions from "../../../actions/schedule.action";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#242105",
    },
    secondary: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#242105",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: theme.palette.background.default,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    borderRadius: "8px",
  },
}));

const MyCalendar = () => {
  const dispatch = useDispatch();
  const scheduleReducer = useSelector(({ scheduleReducer }) => scheduleReducer);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(scheduleActions.getjsonschedule());
  }, [dispatch]);

  useEffect(() => {
    if (scheduleReducer.result) {
      const formattedEvents = scheduleReducer.result.map((event) => ({
        title: event.TITLE,
        start: new Date(event.START),
        end: new Date(event.END),
        room: event.ROOM, // assuming the room data is available in the response
      }));
      setEvents(formattedEvents);
    }
  }, [scheduleReducer.result]);

  const classes = useStyles();
  const localizer = momentLocalizer(moment);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("New Event name");
    const room = window.prompt("Number of rooms");
    if (title && room) {
      const newEvent = { title, start, end, room };
      setEvents([...events, newEvent]);
      // ส่งข้อมูลใหม่ไปยังเซิร์ฟเวอร์ (ถ้าจำเป็น)
      // axios.post('/api/events', newEvent).catch(console.error);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container" style={{ width: "100%" }}>
      <br />
      <br />
      <br />
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView="month"
        style={{ height: "100%", width: "100%" }} // กำหนดความสูงและความกว้างของ Calendar ให้เต็มพื้นที่ที่เหลืออยู่
      />
      <Modal
        open={!!selectedEvent}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <Box className={classes.modalContent}>
          <Typography variant="h6">Event Details</Typography>
          {selectedEvent && (
            <div>
              <Typography>
                <strong>Title:</strong> {selectedEvent.title}
              </Typography>
              <Typography>
                <strong>Start:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
              </Typography>
              <Typography>
                <strong>End:</strong>{" "}
                {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
              </Typography>
              <Typography>
                <strong>Room:</strong> {selectedEvent.room}
              </Typography>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

const PlanPage = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.calendarContainer}>
          <MyCalendar />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PlanPage;
