import { useEffect, useState } from "react";
import API from "../services/api";

function ReviewSection({ doctorId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadReviews = async () => {
    try {
      const res = await API.get(`/reviews/doctor/${doctorId}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      loadReviews();
    }
  }, [doctorId]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      setSubmitting(true);

      await API.post(
        `/reviews?doctorId=${doctorId}&rating=${rating}&comment=${encodeURIComponent(
          comment
        )}`
      );

      alert("Review added successfully!");

      setRating(5);
      setComment("");

      loadReviews();
    } catch (error) {
      console.error("Review error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add review. You may have already reviewed this doctor."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/reviews/${reviewId}`);

      alert("Review deleted successfully.");

      loadReviews();
    } catch (error) {
      console.error("Delete review error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete review."
      );
    }
  };

  const getPatientName = (review) => {
    return review.patient?.name || "Patient";
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="mt-5">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>⭐ Patient Reviews</h3>

        <span className="badge bg-primary">
          {reviews.length} Review
          {reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <hr />

      {/* ADD REVIEW */}
      <div className="card shadow-sm p-4 mb-4">

        <h5 className="mb-3">
          ✍️ Write a Review
        </h5>

        <form onSubmit={submitReview}>

          <div className="mb-3">
            <label className="form-label">
              <strong>Rating</strong>
            </label>

            <select
              className="form-select"
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
            >
              <option value="5">
                ⭐⭐⭐⭐⭐ 5 - Excellent
              </option>
              <option value="4">
                ⭐⭐⭐⭐ 4 - Very Good
              </option>
              <option value="3">
                ⭐⭐⭐ 3 - Good
              </option>
              <option value="2">
                ⭐⭐ 2 - Average
              </option>
              <option value="1">
                ⭐ 1 - Poor
              </option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Comment</strong>
            </label>

            <textarea
              className="form-control"
              rows="4"
              placeholder="Write your experience with this doctor..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "⭐ Submit Review"}
          </button>

        </form>
      </div>

      {/* REVIEW LIST */}
      {reviews.length === 0 ? (

        <div className="alert alert-info">
          No reviews yet. Be the first patient to review
          this doctor!
        </div>

      ) : (

        <div>
          {reviews.map((review) => (

            <div
              className="card shadow-sm mb-3"
              key={review.id}
            >

              <div className="card-body">

                <div className="d-flex justify-content-between">

                  <div>
                    <h6 className="mb-1">
                      👤 {getPatientName(review)}
                    </h6>

                    <div className="text-warning">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>

                  {/* ONLY OWNER CAN SEE DELETE */}
                  {user &&
                    Number(review.patient?.id) ===
                      Number(user.id) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          deleteReview(review.id)
                        }
                      >
                        🗑️ Delete
                      </button>
                    )}

                </div>

                <hr />

                <p className="mb-0">
                  {review.comment}
                </p>

                {review.createdAt && (
                  <small className="text-muted">
                    Posted:{" "}
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </small>
                )}

              </div>

            </div>

          ))}
        </div>

      )}

    </div>
  );
}

export default ReviewSection;