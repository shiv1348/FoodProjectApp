import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";

import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import CountRestaurant from "./CountRestaurant";
import AIRecommendationBanner from "./ai/AIRecommendationBanner";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
    showVegOnly,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(getRestaurants(keyword || ""));
  }, [dispatch, keyword]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  return (
    <>
      {!keyword && <AIRecommendationBanner />}
      <CountRestaurant />

      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <section>
          {/* SORT BUTTONS */}
          <div className="sort">
            <button
              className={`sort_veg p-3 ${showVegOnly ? "font-weight-bold" : ""}`}
              onClick={handleToggleVegOnly}
              style={{ cursor: "pointer" }}
            >
              {showVegOnly ? "Show All" : "Pure Veg"}
            </button>

            <button
              className="sort_rev p-3"
              onClick={handleSortByReviews}
              style={{ cursor: "pointer" }}
            >
              Sort By Reviews
            </button>

            <button
              className="sort_rate p-3"
              onClick={handleSortByRatings}
              style={{ cursor: "pointer" }}
            >
              Sort By Ratings
            </button>
          </div>

          {/* RESTAURANTS LIST */}
          <div className="row mt-4">
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((restaurant) =>
                !showVegOnly || restaurant.isVeg ? (
                  <Restaurant key={restaurant._id} restaurant={restaurant} />
                ) : null
              )
            ) : (
              <Message variant="info">No restaurants Found.</Message>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;