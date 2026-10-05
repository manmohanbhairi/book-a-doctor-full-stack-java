import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">

      <Link
        className="navbar-brand fw-bold text-primary"
        to={user ? "/dashboard" : "/"}
      >
        🩺 Book Doctor
      </Link>

      <div className="ms-auto d-flex align-items-center gap-2">

        {user && user.role !== "admin" && (
          <>

            <Link
              className="btn btn-outline-primary"
              to="/doctors"
            >
              Doctors
            </Link>

            <Link
              className="btn btn-outline-success"
              to="/appointments"
            >
              Appointments
            </Link>

            <Link
              className="btn btn-outline-info"
              to="/profile"
            >
              👤 Profile
            </Link>

            <Link
              className="btn btn-outline-danger"
              to="/favorites"
            >
              ❤️ Favorites
            </Link>

          </>
        )}

        {user && user.role === "admin" && (

          <Link
            className="btn btn-outline-warning"
            to="/admin"
          >
            🛠 Admin
          </Link>

        )}

        {user && (

          <button
            className="btn btn-danger"
            onClick={logout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

}

export default Navbar;