import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function AdminDoctors() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    location: "",
    qualification: "",
    hospital: "",
    phone: "",
    about: "",
    experience: "",
    fee: "",
    rating: "",
    image: "",
    available: true
  });

  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const slots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "05:00 PM"
  ];


  // =========================
  // LOAD DOCTORS
  // =========================

  const loadDoctors = async () => {

    try {

      setLoading(true);

      const response = await API.get("/doctors");

      setDoctors(response.data);

    } catch (error) {

      console.error("Error loading doctors:", error);

      alert("Failed to load doctors.");

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadDoctors();

  }, []);


  // =========================
  // DELETE DOCTOR
  // =========================

  const deleteDoctor = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(`/doctors/${id}`);

      alert("Doctor deleted successfully.");

      loadDoctors();

    } catch (error) {

      console.error("Delete doctor error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete doctor."
      );

    }
  };


  // =========================
  // START EDIT
  // =========================

  const startEdit = (doctor) => {

    setEditingDoctor(doctor);

    setForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      location: doctor.location || "",
      qualification: doctor.qualification || "",
      hospital: doctor.hospital || "",
      phone: doctor.phone || "",
      about: doctor.about || "",
      experience: doctor.experience ?? "",
      fee: doctor.fee ?? "",
      rating: doctor.rating ?? "",
      image: doctor.image || "",
      available: doctor.available ?? true
    });

    setAvailableDays(doctor.availableDays || []);

    setAvailableSlots(doctor.availableSlots || []);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };


  // =========================
  // DAYS
  // =========================

  const handleDayChange = (day) => {

    setAvailableDays((previous) => {

      if (previous.includes(day)) {

        return previous.filter(
          (item) => item !== day
        );

      }

      return [...previous, day];

    });

  };


  // =========================
  // SLOTS
  // =========================

  const handleSlotChange = (slot) => {

    setAvailableSlots((previous) => {

      if (previous.includes(slot)) {

        return previous.filter(
          (item) => item !== slot
        );

      }

      return [...previous, slot];

    });

  };


  // =========================
  // UPDATE DOCTOR
  // =========================

  const updateDoctor = async (e) => {

    e.preventDefault();

    try {

      const doctorData = {

        ...form,

        experience:
          form.experience === ""
            ? null
            : Number(form.experience),

        fee:
          form.fee === ""
            ? null
            : Number(form.fee),

        rating:
          form.rating === ""
            ? 0
            : Number(form.rating),

        availableDays,

        availableSlots

      };


      await API.put(
        `/doctors/${editingDoctor.id}`,
        doctorData
      );


      alert("Doctor updated successfully.");

      setEditingDoctor(null);

      loadDoctors();

    } catch (error) {

      console.error("Update doctor error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update doctor."
      );

    }

  };


  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {

    setEditingDoctor(null);

  };


  return (

    <div className="container mt-5 mb-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            👨‍⚕️ Manage Doctors
          </h2>

          <p className="text-muted mb-0">
            View, edit and delete doctors
          </p>

        </div>


        <Link
          to="/admin/add-doctor"
          className="btn btn-primary"
        >
          ➕ Add Doctor
        </Link>

      </div>


      {/* EDIT FORM */}

      {editingDoctor && (

        <div className="card shadow mb-5">

          <div className="card-header bg-warning">

            <h4 className="mb-0">
              ✏️ Edit Doctor
            </h4>

          </div>


          <div className="card-body">

            <form onSubmit={updateDoctor}>

              {/* BASIC INFORMATION */}

              <h5 className="mb-3">
                👤 Basic Information
              </h5>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    className="form-control"
                    value={form.qualification}
                    onChange={handleChange}
                  />

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Hospital
                  </label>

                  <input
                    type="text"
                    name="hospital"
                    className="form-control"
                    value={form.hospital}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* CONTACT */}

              <hr />

              <h5 className="mb-3">
                📍 Contact Information
              </h5>


              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={form.location}
                    onChange={handleChange}
                  />

                </div>


                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* PROFESSIONAL */}

              <hr />

              <h5 className="mb-3">
                🩺 Professional Information
              </h5>


              <div className="row">

                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Experience
                  </label>

                  <input
                    type="number"
                    name="experience"
                    className="form-control"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                  />

                </div>


                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Fee
                  </label>

                  <input
                    type="number"
                    name="fee"
                    className="form-control"
                    min="0"
                    value={form.fee}
                    onChange={handleChange}
                  />

                </div>


                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    className="form-control"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={form.image}
                  onChange={handleChange}
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  About Doctor
                </label>

                <textarea
                  name="about"
                  className="form-control"
                  rows="4"
                  value={form.about}
                  onChange={handleChange}
                />

              </div>


              {/* DAYS */}

              <hr />

              <h5>
                📅 Available Days
              </h5>

              <div className="d-flex flex-wrap gap-3 mb-4 mt-3">

                {days.map((day) => (

                  <div
                    className="form-check"
                    key={day}
                  >

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`edit-${day}`}
                      checked={availableDays.includes(day)}
                      onChange={() =>
                        handleDayChange(day)
                      }
                    />

                    <label
                      className="form-check-label"
                      htmlFor={`edit-${day}`}
                    >
                      {day}
                    </label>

                  </div>

                ))}

              </div>


              {/* SLOTS */}

              <h5>
                ⏰ Available Time Slots
              </h5>

              <div className="row mt-3 mb-4">

                {slots.map((slot) => (

                  <div
                    className="col-md-4 mb-2"
                    key={slot}
                  >

                    <div className="form-check">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`edit-${slot}`}
                        checked={availableSlots.includes(slot)}
                        onChange={() =>
                          handleSlotChange(slot)
                        }
                      />

                      <label
                        className="form-check-label"
                        htmlFor={`edit-${slot}`}
                      >
                        {slot}
                      </label>

                    </div>

                  </div>

                ))}

              </div>


              {/* AVAILABLE */}

              <div className="form-check form-switch mb-4">

                <input
                  className="form-check-input"
                  type="checkbox"
                  name="available"
                  id="edit-available"
                  checked={form.available}
                  onChange={handleChange}
                />

                <label
                  className="form-check-label"
                  htmlFor="edit-available"
                >
                  Doctor is currently available
                </label>

              </div>


              <button
                type="submit"
                className="btn btn-success me-2"
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            </form>

          </div>

        </div>

      )}


      {/* DOCTORS LIST */}

      {loading ? (

        <div className="text-center mt-5">

          <h4>
            Loading doctors...
          </h4>

        </div>

      ) : doctors.length === 0 ? (

        <div className="alert alert-info text-center">

          No doctors found.

        </div>

      ) : (

        <div className="row g-4">

          {doctors.map((doctor) => (

            <div
              className="col-md-6 col-lg-4"
              key={doctor.id}
            >

              <div className="card shadow h-100">

                <div className="text-center pt-4">

                  {doctor.image ? (

                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      style={{
                        width: "130px",
                        height: "130px",
                        objectFit: "cover"
                      }}
                      className="rounded-circle"
                    />

                  ) : (

                    <div
                      style={{
                        fontSize: "100px"
                      }}
                    >
                      👨‍⚕️
                    </div>

                  )}

                </div>


                <div className="card-body">

                  <h4 className="text-center">
                    {doctor.name}
                  </h4>

                  <p className="text-center text-primary fw-bold">
                    {doctor.specialization}
                  </p>

                  <hr />

                  <p className="mb-2">
                    🏥 <strong>Hospital:</strong>{" "}
                    {doctor.hospital || "N/A"}
                  </p>

                  <p className="mb-2">
                    📍 <strong>Location:</strong>{" "}
                    {doctor.location || "N/A"}
                  </p>

                  <p className="mb-2">
                    🎓 <strong>Qualification:</strong>{" "}
                    {doctor.qualification || "N/A"}
                  </p>

                  <p className="mb-2">
                    ⭐ <strong>Rating:</strong>{" "}
                    {doctor.rating ?? 0}
                  </p>

                  <p className="mb-2">
                    💰 <strong>Fee:</strong>{" "}
                    ₹{doctor.fee ?? 0}
                  </p>

                  <p className="mb-3">

                    <strong>Status:</strong>{" "}

                    {doctor.available ? (

                      <span className="badge bg-success">
                        Available
                      </span>

                    ) : (

                      <span className="badge bg-danger">
                        Unavailable
                      </span>

                    )}

                  </p>


                  <div className="d-grid gap-2">

                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="btn btn-primary"
                    >
                      👁️ View Profile
                    </Link>


                    <button
                      className="btn btn-warning"
                      onClick={() => startEdit(doctor)}
                    >
                      ✏️ Edit Doctor
                    </button>


                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteDoctor(doctor.id)
                      }
                    >
                      🗑️ Delete Doctor
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default AdminDoctors;