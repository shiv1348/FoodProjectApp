import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideAnalyticsModal } from "../../redux/actions/aiActions";

const ReviewAnalyticsModal = () => {
  const dispatch = useDispatch();
  const { activeAnalyticsRestaurantId, analyticsData, analyticsLoading } = useSelector(
    (state) => state.ai || {}
  );

  const [selectedTag, setSelectedTag] = useState(null);
  const [filterRating, setFilterRating] = useState(0);

  if (!activeAnalyticsRestaurantId) return null;

  const handleClose = () => {
    dispatch(hideAnalyticsModal());
  };

  const sentiment = analyticsData?.sentiment || { positive: 65, neutral: 25, negative: 10 };
  const topDishes = analyticsData?.topDishes || [];
  const ratingDistribution = analyticsData?.ratingDistribution || {};
  const totalReviews = analyticsData?.totalReviews || 0;

  // Filter reviews
  let filteredReviews = analyticsData?.reviews || [];
  if (filterRating > 0) {
    filteredReviews = filteredReviews.filter((r) => Math.round(r.rating) === filterRating);
  }
  if (selectedTag) {
    filteredReviews = filteredReviews.filter((r) =>
      (r.comment || "").toLowerCase().includes(selectedTag.toLowerCase())
    );
  }

  return (
    <div className="analytics-modal-backdrop" onClick={handleClose}>
      <div className="analytics-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="analytics-modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">📊</span>
              <h4 className="m-0 fw-bold">{analyticsData?.restaurantName || "Restaurant"} - AI Insights</h4>
            </div>
            <p className="text-muted small m-0 mt-1">
              Deep analysis powered by {totalReviews} authentic verified reviews
            </p>
          </div>
          <button className="btn btn-close fs-5" onClick={handleClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="analytics-modal-body p-4">
          {analyticsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Analyzing customer sentiment &amp; dishes...</p>
            </div>
          ) : (
            <>
              {/* Row 1: Sentiment Score & AI Summary */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-5">
                  <div className="card h-100 p-3 shadow-sm border-0 bg-light">
                    <h6 className="fw-bold mb-3">😊 Customer Sentiment Score</h6>

                    {/* Progress multi-bar */}
                    <div className="progress sentiment-progress-bar mb-3" style={{ height: "14px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${sentiment.positive}%` }}
                        title={`Positive: ${sentiment.positive}%`}
                      ></div>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${sentiment.neutral}%` }}
                        title={`Neutral: ${sentiment.neutral}%`}
                      ></div>
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${sentiment.negative}%` }}
                        title={`Negative: ${sentiment.negative}%`}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between text-center">
                      <div>
                        <span className="badge bg-success p-2">{sentiment.positive}%</span>
                        <div className="small text-muted mt-1">Positive</div>
                      </div>
                      <div>
                        <span className="badge bg-warning text-dark p-2">{sentiment.neutral}%</span>
                        <div className="small text-muted mt-1">Neutral</div>
                      </div>
                      <div>
                        <span className="badge bg-danger p-2">{sentiment.negative}%</span>
                        <div className="small text-muted mt-1">Negative</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-7">
                  <div className="card h-100 p-3 shadow-sm border-0 bg-light">
                    <h6 className="fw-bold mb-2">🤖 AI Feedback Summary</h6>
                    <p className="small text-secondary mb-0 leading-relaxed">
                      {analyticsData?.summaryText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Top Dish Mentions & Ratings Breakdown */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                  <div className="card h-100 p-3 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold m-0">🏷️ Most Mentioned Dishes</h6>
                      {selectedTag && (
                        <button
                          className="btn btn-link btn-sm text-decoration-none p-0"
                          onClick={() => setSelectedTag(null)}
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {topDishes.map((item, idx) => (
                        <button
                          key={idx}
                          className={`btn btn-sm ${
                            selectedTag === item.dish
                              ? "btn-primary text-white"
                              : "btn-outline-secondary"
                          } rounded-pill`}
                          onClick={() => setSelectedTag(selectedTag === item.dish ? null : item.dish)}
                        >
                          #{item.dish} <span className="badge bg-light text-dark ms-1">{item.mentions}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-5">
                  <div className="card h-100 p-3 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold m-0">⭐ Star Ratings</h6>
                      {filterRating > 0 && (
                        <button
                          className="btn btn-link btn-sm text-decoration-none p-0"
                          onClick={() => setFilterRating(0)}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingDistribution[stars] || 0;
                      const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div
                          key={stars}
                          className="d-flex align-items-center gap-2 mb-1 cursor-pointer"
                          onClick={() => setFilterRating(filterRating === stars ? 0 : stars)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className="small text-muted" style={{ width: "30px" }}>
                            {stars}★
                          </span>
                          <div className="progress flex-grow-1" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-warning"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="small text-muted" style={{ width: "25px" }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 3: Reviews List */}
              <div className="card p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold m-0">
                    💬 Verified Customer Reviews ({filteredReviews.length})
                  </h6>
                  {(selectedTag || filterRating > 0) && (
                    <span className="badge bg-info text-dark">
                      Filters: {selectedTag ? `#${selectedTag} ` : ""}{filterRating ? `${filterRating}★` : ""}
                    </span>
                  )}
                </div>

                <div className="reviews-scroll-list" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {filteredReviews.length === 0 ? (
                    <p className="text-muted text-center py-3">No reviews match the selected filter.</p>
                  ) : (
                    filteredReviews.map((rev) => (
                      <div key={rev.id} className="p-2 mb-2 bg-light rounded border-start border-3 border-success">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold small">{rev.name}</span>
                          <span className="badge bg-warning text-dark">★ {rev.rating}</span>
                        </div>
                        <p className="m-0 mt-1 small text-secondary">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="analytics-modal-footer p-3 border-top text-end">
          <button className="btn btn-secondary px-4" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalyticsModal;
