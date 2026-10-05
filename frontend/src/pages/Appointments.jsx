import { useEffect, useState } from "react";
import API from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      // Patient ID is now taken from JWT in the backend
      const res = await API.get("/appointments/patient");

      setAppointments(res.data);
    } catch (error) {
      console.error("Error loading appointments:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await API.put(`/appointments/${appointmentId}/cancel`);

      alert("Appointment cancelled successfully.");

      // Reload appointments
      loadAppointments();
    } catch (error) {
      console.error("Cancel appointment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading appointments...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>📅 My Appointments</h2>
          <p className="text-muted">
            View and manage your doctor appointments
          </p>
        </div>
      </div>

      {/* No appointments */}
      {appointments.length === 0 ? (
        <div className="card shadow-sm p-5 text-center">
          <div style={{ fontSize: "60px" }}>📅</div>

          <h4 className="mt-3">
            No Appointments Found
          </h4>

          <p className="text-muted">
            You haven't booked any appointments yet.
          </p>

          <a
            href="/doctors"
            className="btn btn-primary mt-2"
          >
            Find a Doctor
          </a>
        </div>
      ) : (

        /* Appointment list */
        <div className="row">

          {appointments.map((appointment) => {

            const doctor = appointment.doctor;

            const isCancelled =
              appointment.status?.toLowerCase() ===
              "cancelled";

            return (
              <div
                className="col-md-6 col-lg-4 mb-4"
                key={appointment.id}
              >

                <div className="card shadow-sm h-100">

                  {/* Doctor Image */}
                  <div className="text-center pt-4">

                    {doctor?.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: "80px",
                        }}
                      >
                        👨‍⚕️
                      </div>
                    )}

                  </div>

                  <div className="card-body">

                    {/* Doctor */}
                    <h5 className="card-title text-center">
                      {doctor?.name || "Doctor"}
                    </h5>

                    <p className="text-primary text-center">
                      {doctor?.specialization ||
                        "Medical Specialist"}
                    </p>

                    <hr />

                    {/* Appointment information */}

                    <p>
                      <strong>📅 Date & Time:</strong>
                      <br />
                      {formatDate(
                        appointment.appointmentDate
                      )}
                    </p>

                    <p>
                      <strong>🏥 Hospital:</strong>
                      <br />
                      {doctor?.hospital || "N/A"}
                    </p>

                    <p>
                      <strong>📍 Location:</strong>
                      <br />
                      {doctor?.location || "N/A"}
                    </p>

                    {/* Status */}

                    <p>
                      <strong>Status:</strong>{" "}

                      <span
                        className={
                          isCancelled
                            ? "badge bg-danger"
                            : "badge bg-success"
                        }
                      >
                        {appointment.status ||
                          "Booked"}
                      </span>
                    </p>

                    {/* Cancel button */}

                    {!isCancelled && (
                      <button
                        className="btn btn-outline-danger w-100 mt-2"
                        onClick={() =>
                          cancelAppointment(
                            appointment.id
                          )
                        }
                      >
                        ❌ Cancel Appointment
                      </button>
                    )}

                    {isCancelled && (
                      <div className="alert alert-danger mt-3 mb-0">
                        This appointment has been
                        cancelled.
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Appointments;