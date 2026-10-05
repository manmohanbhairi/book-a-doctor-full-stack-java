import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==============================
  // Load profile
  // ==============================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const res = await API.get("/profile");

        console.log("Profile response:", res.data);

        setProfile(res.data);

      } catch (error) {

        console.error(
          "Profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load profile."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // ==============================
  // Loading
  // ==============================

  if (loading) {

    return (

      <div className="container mt-5 text-center">

        <h3>
          Loading Profile...
        </h3>

      </div>

    );

  }


  // ==============================
  // Error
  // ==============================

  if (error) {

    return (

      <div className="container mt-5 text-center">

        <div className="alert alert-danger">

          {error}

        </div>

      </div>

    );

  }


  // ==============================
  // Profile
  // ==============================

  return (

    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-md-7">

          <div className="card shadow p-5">

            <div className="text-center">

              <div
                style={{
                  fontSize: "90px"
                }}
              >
                👤
              </div>


              <h2 className="mt-3">
                My Profile
              </h2>

              <hr />

            </div>


            <div className="mt-3">

              <p>
                <strong>
                  📧 Email:
                </strong>{" "}
                {profile?.email || "N/A"}
              </p>


              <p>
                <strong>
                  🔐 Authentication:
                </strong>{" "}
                {profile?.message ||
                  "Authenticated"}
              </p>


              <p>
                <strong>
                  👤 Role:
                </strong>{" "}

                {profile?.authorities?.length > 0
                  ? profile.authorities
                      .map(
                        (authority) =>
                          authority.authority
                      )
                      .join(", ")
                  : "USER"}

              </p>

            </div>


            <div className="alert alert-success mt-4">

              ✅ Your JWT authentication is
              working correctly.

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;