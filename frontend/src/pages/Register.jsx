import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", form);

      alert("Registered Successfully");

      navigate("/");

    } catch (error) {

      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card p-5">

            <h2 className="text-center mb-4">
              Create Account 🩺
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                className="form-control mb-3"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                required
              />

              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                required
              />

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Register
              </button>

            </form>

            <p className="text-center mt-3">

              Already have account?

              <Link to="/">
                {" "}Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Register;