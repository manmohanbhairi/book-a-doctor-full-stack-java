import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Favorites() {

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch my favorites
  // ==============================

  const fetchFavorites = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      /*
       * IMPORTANT:
       *
       * We no longer send patientId.
       *
       * Backend identifies the logged-in
       * patient using the JWT token.
       */

      const res = await API.get(
        "/favorites/patient"
      );

      setFavorites(res.data);

    } catch (error) {

      console.error(
        "Error loading favorites:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to load favorites."
      );

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // Load favorites when page opens
  // ==============================

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ==============================
  // Remove favorite
  // ==============================

  const removeFavorite = async (doctorId) => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      /*
       * Only doctorId is sent.
       *
       * Backend gets the patient
       * from the JWT.
       */

      await API.delete(
        `/favorites?doctorId=${doctorId}`
      );

      alert("Removed from favorites ❤️");

      // Refresh list
      fetchFavorites();

    } catch (error) {

      console.error(
        "Remove favorite error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to remove favorite."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {

    return (
      <div className="container mt-5 text-center">

        <h3>
          Loading favorites...
        </h3>

      </div>
    );
  }

  // ==============================
  // Favorites page
  // ==============================

  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        ❤️ My Favorite Doctors
      </h2>

      {/* ==============================
          No favorites
      ============================== */}

      {favorites.length === 0 ? (

        <div className="card shadow-sm p-5 text-center">

          <h4>
            No Favorite Doctors
          </h4>

          <p className="text-muted">
            You haven't added any doctors
            to your favorites yet.
          </p>

          <Link
            to="/doctors"
            className="btn btn-primary"
          >
            Find Doctors
          </Link>

        </div>

      ) : (

        /* ==============================
           Favorite doctors
        ============================== */

        <div className="row">

          {favorites.map((favorite) => {

            const doctor = favorite.doctor;

            if (!doctor) {
              return null;
            }

            return (

              <div
                className="col-md-6 col-lg-4 mb-4"
                key={favorite.id}
              >

                <div className="card h-100 shadow-sm p-4 text-center">

                  {/* Doctor image */}

                  {doctor.image ? (

                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="rounded-circle mx-auto"
                      style={{
                        width: "130px",
                        height: "130px",
                        objectFit: "cover"
                      }}
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

                  {/* Doctor name */}

                  <h4 className="mt-3">
                    {doctor.name}
                  </h4>

                  {/* Specialization */}

                  <h6 className="text-primary">
                    {doctor.specialization}
                  </h6>

                  {/* Hospital */}

                  <p>
                    🏥 {doctor.hospital}
                  </p>

                  {/* Location */}

                  <p>
                    📍 {doctor.location}
                  </p>

                  {/* Rating */}

                  <p>
                    ⭐ {doctor.rating}
                  </p>

                  {/* Buttons */}

                  <div className="d-flex gap-2">

                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="btn btn-primary w-100"
                    >
                      View Profile
                    </Link>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        removeFavorite(doctor.id)
                      }
                    >
                      ❤️
                    </button>

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

export default Favorites;