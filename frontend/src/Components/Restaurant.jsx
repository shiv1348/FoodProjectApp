import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchRestaurantAnalytics } from "../redux/actions/aiActions";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);

  const imageUrl =
    restaurant.images?.[0]?.url ||
    restaurant.image?.[0]?.url ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop";

  const reviewCount =
    restaurant.numOfReviews ||
    restaurant.numberofReviews ||
    (restaurant.reviews ? restaurant.reviews.length : 0);

  const sentiment =
    restaurant.reviewSentiment ||
    (restaurant.ratings >= 4.0
      ? "Very Positive"
      : restaurant.ratings >= 3.0
      ? "Positive"
      : "Average");

  const summaryBullets = restaurant.reviewSummaryBullets || [
    "Fresh and flavorful ingredients",
    "Courteous and prompt service",
    "Generous portion sizes and great taste",
  ];

  const mentions = restaurant.reviewTopMentions || [
    "Taste",
    "Quality",
    "Packaging",
    "Value",
  ];

  return (
    <div className="col-12 my-3">
      <div className="card restaurant-card p-3 shadow-sm">
        <Link to={`/eats/stores/${restaurant._id}/menus`}>
          <img
            className="restaurant-image"
            src={imageUrl}
            alt={restaurant.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop";
            }}
          />
        </Link>

        <div className="restaurant-info">
          <Link
            to={`/eats/stores/${restaurant._id}/menus`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h4 style={{ cursor: "pointer" }}>{restaurant.name}</h4>
          </Link>

          <p className="rest_address">{restaurant.address}</p>

          <div className="ratings">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(restaurant.ratings / 5) * 100}%`,
                }}
              ></div>
            </div>

            <span className="ml-2 font-weight-bold">
              ★ {restaurant.ratings} ({reviewCount} Reviews)
            </span>

            {restaurant.isVeg && (
              <span className="badge badge-success ml-2 p-1">Pure Veg</span>
            )}
          </div>

          <div className="d-flex gap-2 mt-2 flex-wrap">
            <button
              className="ai-btn"
              onClick={() => setShowAI(!showAI)}
              style={{ cursor: "pointer" }}
            >
              {showAI ? "➖ Quick Insights" : "💬 Quick Insights"}
            </button>
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 font-weight-bold"
              onClick={() => dispatch(fetchRestaurantAnalytics(restaurant._id))}
              title="Open full AI review & sentiment analytics"
            >
              📊 Deep AI Analytics
            </button>
          </div>
        </div>

        {showAI && (
          <div className="ai-insights-box">
            <div className="ai-status">
              Sentiment: <strong>😊 {sentiment}</strong>
            </div>

            <ul className="mt-2 pl-3">
              {summaryBullets.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            <div className="mentions">
              {mentions.map((item, index) => (
                <span key={index} className="mention-tag">
                  #{item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;