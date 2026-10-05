import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import ReviewSection from "../components/ReviewSection";

function DoctorProfile() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Load doctor
  // ==============================

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await API.get(`/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (error) {
        console.error("Error loading doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadDoctor();
    }
  }, [doctorId]);

  // ==============================
  // Check favorite
  // ==============================

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");

        // No logged-in user
        if (!token) {
          setIsFavorite(false);
          return;
        }

        /*
         * IMPORTANT:
         * We no longer send patientId.
         *
         * Backend gets the logged-in user
         * from the JWT token.
         */
        const res = await API.get("/favorites/patient");

        const favoriteExists = res.data.some(
          (favorite) =>
            favorite.doctor?.id === Number(doctorId)
        );

        setIsFavorite(favoriteExists);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    if (doctorId) {
      checkFavorite();
    }
  }, [doctorId]);

  // ==============================
  // Add / Remove Favorite
  // ==============================

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      // ==============================
      // Remove favorite
      // ==============================

      if (isFavorite) {
        await API.delete(
          `/favorites?doctorId=${doctorId}`
        );

        setIsFavorite(false);

        alert("Removed from Favorites ❤️");
      }

      // ==============================
      // Add favorite
      // ==============================

      else {
        await API.post(
          `/favorites?doctorId=${doctorId}`
        );

        setIsFavorite(true);

        alert("Doctor added to Favorites ❤️");
      }
    } catch (error) {
      console.error("Favorite error:", error);

      alert(
        error.response?.data?.message ||
        "Favorite operation failed."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading doctor...</h3>
      </div>
    );
  }

  // ==============================
  // Doctor not found
  // ==============================

  if (!doctor) {
    return (
      <div className="container mt-5 text-center">
        <h3>Doctor not found</h3>

        <Link
          to="/doctors"
          className="btn btn-primary mt-3"
        >
          Back to Doctors
        </Link>
      </div>
    );
  }

  // ==============================
  // Doctor Profile
  // ==============================

  return (
    <div className="container mt-5 mb-5">

      <div className="card shadow p-4">

        <div className="row">

          {/* =========================
              Doctor Image
          ========================== */}

          <div className="col-md-4 text-center">

            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="img-fluid rounded-circle"
                style={{
                  width: "220px",
                  height: "220px",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={{ fontSize: "150px" }}>
                👨‍⚕️
              </div>
            )}

            <div className="mt-3">

              <span
                className={
                  doctor.available
                    ? "badge bg-success"
                    : "badge bg-danger"
                }
              >
                {doctor.available
                  ? "Available Today"
                  : "Unavailable"}
              </span>

            </div>

          </div>

          {/* =========================
              Doctor Information
          ========================== */}

          <div className="col-md-8">

            <h1>
              {doctor.name}
            </h1>

            <h4 className="text-primary">
              {doctor.specialization}
            </h4>

            <hr />

            <p>
              ⭐ <strong>Rating:</strong>{" "}
              {doctor.rating}
            </p>

            <p>
              🎓 <strong>Qualification:</strong>{" "}
              {doctor.qualification}
            </p>

            <p>
              🏥 <strong>Hospital:</strong>{" "}
              {doctor.hospital}
            </p>

            <p>
              📍 <strong>Location:</strong>{" "}
              {doctor.location}
            </p>

            <p>
              ⏳ <strong>Experience:</strong>{" "}
              {doctor.experience} Years
            </p>

            <p>
              💰 <strong>Consultation Fee:</strong>{" "}
              ₹{doctor.fee}
            </p>

            <p>
              📞 <strong>Phone:</strong>{" "}
              {doctor.phone}
            </p>

            <hr />

            {/* =========================
                Available Days
            ========================== */}

            <h5>
              📅 Available Days
            </h5>

            {doctor.availableDays &&
            doctor.availableDays.length > 0 ? (
              <div className="mb-3">

                {doctor.availableDays.map((day) => (
                  <span
                    key={day}
                    className="badge bg-primary me-2 mb-2"
                  >
                    {day}
                  </span>
                ))}

              </div>
            ) : (
              <p>
                No availability information
              </p>
            )}

            {/* =========================
                Available Slots
            ========================== */}

            <h5>
              ⏰ Available Time Slots
            </h5>

            {doctor.availableSlots &&
            doctor.availableSlots.length > 0 ? (
              <div className="mb-4">

                {doctor.availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className="badge bg-success me-2 mb-2"
                  >
                    {slot}
                  </span>
                ))}

              </div>
            ) : (
              <p>
                No time slots available
              </p>
            )}

            {/* =========================
                About
            ========================== */}

            {doctor.about && (
              <div className="mb-4">

                <h5>
                  About Doctor
                </h5>

                <p>
                  {doctor.about}
                </p>

              </div>
            )}

            {/* =========================
                Buttons
            ========================== */}

            <div className="d-flex gap-2 flex-wrap">

              {/* Book */}

              <Link
                to={`/book/${doctorId}`}
                className="btn btn-primary"
              >
                📅 Book Appointment
              </Link>

              {/* Favorite */}

              <button
                className={
                  isFavorite
                    ? "btn btn-danger"
                    : "btn btn-outline-danger"
                }
                onClick={toggleFavorite}
              >
                {isFavorite
                  ? "❤️ Remove Favorite"
                  : "♡ Add to Favorites"}
              </button>

              {/* Back */}

              <Link
                to="/doctors"
                className="btn btn-secondary"
              >
                ← Back to Doctors
              </Link>

            </div>

            {/* =========================
                Reviews
            ========================== */}

            <ReviewSection
              doctorId={doctorId}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default DoctorProfile;