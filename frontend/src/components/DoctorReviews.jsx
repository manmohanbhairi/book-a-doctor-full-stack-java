import { useEffect, useState } from "react";
import API from "../services/api";

function DoctorReviews({ doctorId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = () => {
    API.get(`/reviews/${doctorId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadReviews();
  }, [doctorId]);

  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        doctorId,
        rating,
        comment,
      });

      alert("Review Added Successfully");

      setComment("");
      setRating(5);

      loadReviews();

    } catch (err) {
      console.log(err);
      alert("Unable to submit review");
    }
  };

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No Ratings";

  return (
    <div className="review-card mt-5">

      <h3>⭐ Reviews & Ratings</h3>

      <h5 className="text-warning">
        Average Rating : {average}
      </h5>

      <div className="mt-4">

        <label>Rating</label>

        <select
          className="form-select"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <textarea
          className="form-control mt-3"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="btn btn-primary mt-3"
          onClick={submitReview}
        >
          Submit Review
        </button>

      </div>

      <hr />

      {reviews.length === 0 ? (
        <p>No Reviews Yet</p>
      ) : (
        reviews.map((review) => (
          <div className="review-item" key={review._id}>

            <h5>
              {review.patientId?.name}
            </h5>

            <h6 className="text-warning">
              {"⭐".repeat(review.rating)}
            </h6>

            <p>{review.comment}</p>

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default DoctorReviews;