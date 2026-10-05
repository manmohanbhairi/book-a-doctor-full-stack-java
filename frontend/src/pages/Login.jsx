import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Spring Boot returns user information directly,
      // not inside res.data.user
      const user = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      };

      // Save user information
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (res.data.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {

      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card p-5">

            <h2 className="text-center mb-4">
              🩺 Login
            </h2>

            <form onSubmit={handleSubmit}>

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
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>

            <p className="text-center mt-3">

              Don't have account?

              <Link to="/register">
                {" "}Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;