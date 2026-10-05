import { Link } from "react-router-dom";

function Admin() {
  return (
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="text-muted">
          Manage doctors, appointments and the Book Doctor system
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">

        {/* Add Doctor */}
        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center p-4">

              <div style={{ fontSize: "60px" }}>
                👨‍⚕️
              </div>

              <h4 className="mt-3">
                Add Doctor
              </h4>

              <p className="text-muted">
                Add a new doctor to the healthcare system.
              </p>

              <Link
                to="/admin/add-doctor"
                className="btn btn-primary"
              >
                ➕ Add Doctor
              </Link>

            </div>
          </div>
        </div>

        {/* Manage Doctors */}
        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center p-4">

              <div style={{ fontSize: "60px" }}>
                🩺
              </div>

              <h4 className="mt-3">
                Manage Doctors
              </h4>

              <p className="text-muted">
                View, edit and delete doctors.
              </p>

              <Link
                to="/admin/doctors"
                className="btn btn-success"
              >
                👨‍⚕️ Manage Doctors
              </Link>

            </div>
          </div>
        </div>

        {/* Manage Appointments */}
        <div className="col-md-4">
          <div className="card shadow h-100">
            <div className="card-body text-center p-4">

              <div style={{ fontSize: "60px" }}>
                📅
              </div>

              <h4 className="mt-3">
                Appointments
              </h4>

              <p className="text-muted">
                View and manage patient appointments.
              </p>

              <Link
                to="/admin/appointments"
                className="btn btn-warning"
              >
                📋 Manage Appointments
              </Link>

            </div>
          </div>
        </div>

      </div>

      {/* Admin Information */}
      <div className="card shadow mt-5">
        <div className="card-body p-4">

          <h4>
            🔐 Administrator Access
          </h4>

          <hr />

          <p className="mb-2">
            <strong>Role:</strong> Administrator
          </p>

          <p className="mb-2">
            <strong>Access:</strong> Doctor Management, Appointment Management
          </p>

          <p className="mb-0 text-muted">
            Use the options above to manage the Book Doctor application.
          </p>

        </div>
      </div>

    </div>
  );
}

export default Admin;