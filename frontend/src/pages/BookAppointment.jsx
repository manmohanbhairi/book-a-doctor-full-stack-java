import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../services/api";

function BookAppointment() {

  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [booking, setBooking] = useState(false);

  // Default time slots
  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "05:00 PM",
  ];

  // ==========================================
  // LOAD DOCTOR
  // ==========================================

  useEffect(() => {

    const loadDoctor = async () => {

      try {

        const res = await API.get(
          `/doctors/${doctorId}`
        );

        setDoctor(res.data);

      } catch (error) {

        console.error(
          "Error loading doctor:",
          error
        );

      } finally {

        setLoadingDoctor(false);
      }
    };

    if (doctorId) {
      loadDoctor();
    }

  }, [doctorId]);


  // ==========================================
  // CHECK PAST TIME
  // ==========================================

  const isPastTime = (slot) => {

    if (!date) {
      return false;
    }

    const today = new Date();

    const selectedDate = new Date(date);

    // If selected date is not today
    if (
      selectedDate.toDateString() !==
      today.toDateString()
    ) {
      return false;
    }

    let [timePart, period] = slot.split(" ");

    let [hour, minute] = timePart.split(":");

    hour = parseInt(hour);
    minute = parseInt(minute);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const slotTime = new Date();

    slotTime.setHours(hour);
    slotTime.setMinutes(minute);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    return slotTime <= new Date();
  };


  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const bookAppointment = async () => {

    if (!date) {
      alert("Please select an appointment date.");
      return;
    }

    if (!time) {
      alert("Please select an appointment time.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    try {

      setBooking(true);

      // Convert selected date + time to LocalDateTime format
      const selectedDate =
        date.toISOString().split("T")[0];

      let [timePart, period] = time.split(" ");

      let [hour, minute] =
        timePart.split(":");

      hour = parseInt(hour);
      minute = parseInt(minute);

      if (
        period === "PM" &&
        hour !== 12
      ) {
        hour += 12;
      }

      if (
        period === "AM" &&
        hour === 12
      ) {
        hour = 0;
      }

      const formattedHour =
        String(hour).padStart(2, "0");

      const formattedMinute =
        String(minute).padStart(2, "0");

      const appointmentDate =
        `${selectedDate}T${formattedHour}:${formattedMinute}:00`;

      /*
       * IMPORTANT:
       *
       * We DO NOT send patientId anymore.
       *
       * Spring Boot gets the logged-in patient
       * from the JWT token.
       */

      const appointmentData = {
        appointmentDate: appointmentDate,
        status: "Booked",
      };

      await API.post(
        `/appointments?doctorId=${doctorId}`,
        appointmentData
      );

      alert(
        "Appointment booked successfully! 🎉"
      );

      // Go to appointments page
      navigate("/appointments");

    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );

    } finally {

      setBooking(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loadingDoctor) {

    return (
      <div className="container mt-5 text-center">
        <h3>
          Loading doctor information...
        </h3>
      </div>
    );
  }


  // ==========================================
  // DOCTOR NOT FOUND
  // ==========================================

  if (!doctor) {

    return (
      <div className="container mt-5 text-center">

        <div className="alert alert-danger">
          Doctor not found.
        </div>

        <Link
          to="/doctors"
          className="btn btn-primary"
        >
          ← Back to Doctors
        </Link>

      </div>
    );
  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow">

            {/* Header */}

            <div className="card-header bg-primary text-white">

              <h4 className="mb-0">
                📅 Book Appointment
              </h4>

            </div>


            <div className="card-body p-4">

              {/* Doctor information */}

              <div className="text-center mb-4">

                {doctor.image ? (

                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />

                ) : (

                  <div
                    style={{
                      fontSize: "100px",
                    }}
                  >
                    👨‍⚕️
                  </div>

                )}

                <h3 className="mt-3">
                  {doctor.name}
                </h3>

                <p className="text-primary mb-1">
                  {doctor.specialization}
                </p>

                <p className="text-muted">
                  🏥 {doctor.hospital}
                  <br />
                  📍 {doctor.location}
                </p>

              </div>


              <hr />


              {/* Date */}

              <div className="mb-4">

                <label className="form-label">

                  <strong>
                    📅 Select Appointment Date
                  </strong>

                </label>

                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => {
                    setDate(selectedDate);
                    setTime("");
                  }}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select a date"
                  className="form-control"
                  wrapperClassName="w-100"
                />

              </div>


              {/* Time */}

              <div className="mb-4">

                <label className="form-label">

                  <strong>
                    ⏰ Select Appointment Time
                  </strong>

                </label>

                <div className="row">

                  {times.map((slot) => {

                    const past =
                      isPastTime(slot);

                    return (

                      <div
                        className="col-6 col-md-4 mb-2"
                        key={slot}
                      >

                        <button
                          type="button"
                          disabled={!date || past}
                          onClick={() =>
                            setTime(slot)
                          }
                          className={
                            time === slot
                              ? "btn btn-primary w-100"
                              : "btn btn-outline-primary w-100"
                          }
                        >

                          {slot}

                          {past && (
                            <small>
                              {" "}
                              (Past)
                            </small>
                          )}

                        </button>

                      </div>

                    );

                  })}

                </div>

                {!date && (
                  <small className="text-muted">
                    Please select a date first.
                  </small>
                )}

              </div>


              {/* Selected appointment */}

              {date && time && (

                <div className="alert alert-info">

                  <strong>
                    Selected Appointment:
                  </strong>

                  <br />

                  📅{" "}
                  {date.toLocaleDateString(
                    "en-IN"
                  )}

                  <br />

                  ⏰ {time}

                </div>

              )}


              {/* Book button */}

              <button
                type="button"
                className="btn btn-success btn-lg w-100"
                onClick={bookAppointment}
                disabled={
                  !date ||
                  !time ||
                  booking
                }
              >

                {booking
                  ? "Booking..."
                  : "📅 Confirm Appointment"}

              </button>


              {/* Back button */}

              <div className="text-center mt-3">

                <Link
                  to={`/doctors/${doctorId}`}
                  className="btn btn-secondary"
                >
                  ← Back to Doctor Profile
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BookAppointment;