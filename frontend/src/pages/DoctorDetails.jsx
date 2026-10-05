import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function DoctorDetails() {

  // ID comes from /doctors/:id
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDoctor = async () => {

      try {

        const res = await API.get(`/doctors/${id}`);

        console.log("Doctor data:", res.data);
        console.log("Doctor ID from URL:", id);

        setDoctor(res.data);

      } catch (err) {

        console.error("Error loading doctor:", err);

        setError("Unable to load doctor details.");

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchDoctor();
    }

  }, [id]);


  if (loading) {

    return (
      <h3 className="text-center mt-5">
        Loading doctor details...
      </h3>
    );

  }


  if (error) {

    return (
      <div className="container mt-5 text-center">

        <h3 className="text-danger">
          {error}
        </h3>

        <Link
          to="/doctors"
          className="btn btn-primary mt-3"
        >
          Back to Doctors
        </Link>

      </div>
    );

  }


  if (!doctor) {

    return (
      <div className="container mt-5 text-center">

        <h3>
          Doctor not found
        </h3>

        <Link
          to="/doctors"
          className="btn btn-primary mt-3"
        >
          Back to Doctors
        </Link>

      </div>
    );

  }


  return (

    <div className="container mt-5 mb-5">

      <div className="card shadow p-4">

        <div className="row">

          {/* Doctor Image */}

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


          {/* Doctor Information */}

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
              {doctor.rating || "No rating"}
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


            {/* Available Days */}

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


            {/* Available Slots */}

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


            {/* About */}

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


            {/* Buttons */}

            <div className="d-flex gap-2">

              {/* IMPORTANT: use URL id, not doctor.id */}

              <Link
                to={`/book/${id}`}
                className="btn btn-primary"
              >
                📅 Book Appointment
              </Link>

              <Link
                to="/doctors"
                className="btn btn-secondary"
              >
                ← Back to Doctors
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default DoctorDetails;