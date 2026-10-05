import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function AdminAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {

    try {

      setLoading(true);

      const response = await API.get("/appointments");

      setAppointments(response.data);

    } catch (error) {

      console.error("Error loading appointments:", error);

      alert(
        error.response?.data?.message ||
        "Failed to load appointments."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const cancelAppointment = async (id) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    try {

      await API.put(`/appointments/${id}/cancel`);

      alert("Appointment cancelled successfully.");

      loadAppointments();

    } catch (error) {

      console.error("Cancel appointment error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to cancel appointment."
      );

    }
  };

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="container mt-5 mb-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            📅 Manage Appointments
          </h2>

          <p className="text-muted mb-0">
            View and manage all patient appointments
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-secondary"
        >
          ← Admin Dashboard
        </Link>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="text-center mt-5">
          <h4>Loading appointments...</h4>
        </div>
      )}


      {/* EMPTY */}

      {!loading && appointments.length === 0 && (
        <div className="alert alert-info text-center">
          No appointments found.
        </div>
      )}


      {/* APPOINTMENTS TABLE */}

      {!loading && appointments.length > 0 && (

        <div className="card shadow">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-primary">

                  <tr>

                    <th>#</th>

                    <th>Patient</th>

                    <th>Patient Email</th>

                    <th>Doctor</th>

                    <th>Specialization</th>

                    <th>Appointment Date</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map((appointment, index) => (

                    <tr key={appointment.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {appointment.patient?.name || "N/A"}
                        </strong>
                      </td>

                      <td>
                        {appointment.patient?.email || "N/A"}
                      </td>

                      <td>
                        {appointment.doctor?.name || "N/A"}
                      </td>

                      <td>
                        {appointment.doctor?.specialization || "N/A"}
                      </td>

                      <td>
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </td>

                      <td>

                        {appointment.status === "Booked" ? (

                          <span className="badge bg-success">
                            Booked
                          </span>

                        ) : (

                          <span className="badge bg-danger">
                            Cancelled
                          </span>

                        )}

                      </td>

                      <td>

                        {appointment.status === "Booked" ? (

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              cancelAppointment(
                                appointment.id
                              )
                            }
                          >
                            ❌ Cancel
                          </button>

                        ) : (

                          <span className="text-muted">
                            No Action
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminAppointments;