import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Doctors() {

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [quickFilter, setQuickFilter] = useState("All");

  useEffect(() => {

    API.get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.log(err));

  }, []);

  const specializations = [
    "All",
    ...new Set(doctors.map((doctor) => doctor.specialization))
  ];

  const filteredDoctors = doctors.filter((doctor) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.specialization?.toLowerCase().includes(searchText) ||
      doctor.location?.toLowerCase().includes(searchText) ||
      doctor.hospital?.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" ||
      doctor.specialization === filter;

    let matchesQuickFilter = true;

    if (quickFilter === "Available") {
      matchesQuickFilter = doctor.available;
    }

    if (quickFilter === "TopRated") {
      matchesQuickFilter = doctor.rating >= 4;
    }

    if (quickFilter === "LowFee") {
      matchesQuickFilter = doctor.fee <= 700;
    }

    return (
      matchesSearch &&
      matchesFilter &&
      matchesQuickFilter
    );

  });

  return (

    <div className="container mt-5">

      {/* Hero */}

      <div className="hero text-center mb-5">

        <h1>
          Find Your Doctor 🩺
        </h1>

        <p>
          Book appointments with trusted doctors near you.
        </p>

      </div>

      {/* Search */}

      <div className="row justify-content-center mb-4">

        <div className="col-md-6 mb-3">

          <input

            type="text"

            className="form-control search-box"

            placeholder="🔍 Search by Name, Hospital, Location or Specialization"

            value={search}

            onChange={(e) => setSearch(e.target.value)}

          />

        </div>

        <div className="col-md-3 mb-3">

          <select

            className="form-select"

            value={filter}

            onChange={(e) => setFilter(e.target.value)}

          >

            {specializations.map((item) => (

              <option key={item}>
                {item}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* Quick Filters */}

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">

        <button

          className={`btn ${quickFilter === "All"
              ? "btn-primary"
              : "btn-outline-primary"
            }`}

          onClick={() => setQuickFilter("All")}

        >

          All

        </button>

        <button

          className={`btn ${quickFilter === "Available"
              ? "btn-success"
              : "btn-outline-success"
            }`}

          onClick={() => setQuickFilter("Available")}

        >

          🟢 Available

        </button>

        <button

          className={`btn ${quickFilter === "TopRated"
              ? "btn-warning"
              : "btn-outline-warning"
            }`}

          onClick={() => setQuickFilter("TopRated")}

        >

          ⭐ Top Rated

        </button>

        <button

          className={`btn ${quickFilter === "LowFee"
              ? "btn-info"
              : "btn-outline-info"
            }`}

          onClick={() => setQuickFilter("LowFee")}

        >

          💰 Under ₹700

        </button>

      </div>

      {/* Doctors */}

      <div className="row">

        {

          filteredDoctors.length === 0 ?

            (

              <div className="text-center">

                <h3>
                  No Doctors Found 😔
                </h3>

              </div>

            )

            :

            (

              filteredDoctors.map((doctor) => (

                <div
                  className="col-lg-4 col-md-6 mb-4"
                  key={doctor.id}
                >

                  <div className="doctor-card h-100 text-center">

                    <img

                      src={doctor.image}

                      alt={doctor.name}

                      className="doctor-img"

                    />

                    <h3 className="mt-3">

                      {doctor.name}

                    </h3>

                    <h5 className="text-primary">

                      {doctor.specialization}

                    </h5>

                    <div className="mb-3">

                      <span className="badge bg-warning text-dark">

                        ⭐ {doctor.rating}

                      </span>

                      <span className="badge bg-secondary ms-2">

                        {doctor.experience} Years

                      </span>

                    </div>

                    <p>

                      🏥 {doctor.hospital}

                    </p>

                    <p>

                      📍 {doctor.location}

                    </p>

                    <p>

                      🎓 {doctor.qualification}

                    </p>

                    <p>

                      💰 Consultation Fee

                      <br />

                      <b>

                        ₹{doctor.fee}

                      </b>

                    </p>

                    <span

                      className={

                        doctor.available

                          ?

                          "badge bg-success"

                          :

                          "badge bg-danger"

                      }

                    >

                      {

                        doctor.available

                          ?

                          "Available Today"

                          :

                          "Unavailable"

                      }

                    </span>

                    <div className="mt-4">

                      <Link

                        to={`/doctors/${doctor.id}`}

                        className="btn btn-primary w-100"

                      >

                        View Profile

                      </Link>

                    </div>

                  </div>

                </div>

              ))

            )

        }

      </div>

    </div>

  );

}

export default Doctors;