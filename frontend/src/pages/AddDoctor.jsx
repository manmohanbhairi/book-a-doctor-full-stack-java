import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddDoctor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    location: "Hyderabad",
    qualification: "",
    hospital: "",
    phone: "",
    about: "",
    experience: "",
    fee: "",
    rating: "0",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleDayChange = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day)
        ? prev.filter((item) => item !== day)
        : [...prev, day]
    );
  };

  const handleSlotChange = (slot) => {
    setAvailableSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((item) => item !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const doctorData = {
        ...form,
        experience: Number(form.experience),
        fee: Number(form.fee),
        rating: Number(form.rating),
        availableDays,
        availableSlots
      };

      await API.post("/doctors", doctorData);

      alert("Doctor added successfully!");

      navigate("/admin/doctors");

    } catch (error) {
      console.error("Add doctor error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to add doctor."
      );
    }
  };

  return (
    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card shadow">

            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                👨‍⚕️ Add New Doctor
              </h3>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                {/* Basic Information */}

                <h5 className="mb-3">
                  👤 Basic Information
                </h5>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Doctor Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Dr. John Smith"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Specialization *
                    </label>

                    <input
                      type="text"
                      name="specialization"
                      className="form-control"
                      placeholder="Cardiologist"
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
                      placeholder="MBBS, MD"
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
                      placeholder="Apollo Hospital"
                      value={form.hospital}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                {/* Contact */}

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
                      placeholder="Hyderabad"
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
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                {/* Professional Information */}

                <hr />

                <h5 className="mb-3">
                  🩺 Professional Information
                </h5>

                <div className="row">

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Experience (Years)
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
                      Consultation Fee (₹)
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
                    Profile Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    placeholder="https://example.com/doctor.jpg"
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
                    placeholder="Write a short description about the doctor..."
                    value={form.about}
                    onChange={handleChange}
                  />
                </div>

                {/* Available Days */}

                <hr />

                <h5 className="mb-3">
                  📅 Available Days
                </h5>

                <div className="d-flex flex-wrap gap-2 mb-4">

                  {days.map((day) => (
                    <div
                      className="form-check"
                      key={day}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={day}
                        checked={availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                      />

                      <label
                        className="form-check-label"
                        htmlFor={day}
                      >
                        {day}
                      </label>
                    </div>
                  ))}

                </div>

                {/* Available Slots */}

                <h5 className="mb-3">
                  ⏰ Available Time Slots
                </h5>

                <div className="row mb-4">

                  {slots.map((slot) => (
                    <div
                      className="col-md-4 mb-2"
                      key={slot}
                    >

                      <div className="form-check">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={slot}
                          checked={availableSlots.includes(slot)}
                          onChange={() => handleSlotChange(slot)}
                        />

                        <label
                          className="form-check-label"
                          htmlFor={slot}
                        >
                          {slot}
                        </label>

                      </div>

                    </div>
                  ))}

                </div>

                {/* Availability */}

                <div className="form-check form-switch mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="available"
                    id="available"
                    checked={form.available}
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label"
                    htmlFor="available"
                  >
                    Doctor is currently available
                  </label>

                </div>

                {/* Buttons */}

                <div className="d-flex gap-2">

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    ➕ Add Doctor
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin")}
                  >
                    ← Back to Admin
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddDoctor;