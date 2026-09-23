import React from "react";
import { useSelector } from "react-redux";
import "./css/count.css";

const CountRestaurant = () => {
  const { count, pureVegRestaurantsCount, showVegOnly, loading, error, restaurants } =
    useSelector((state) => state.restaurants);

  const displayCount = showVegOnly
    ? (pureVegRestaurantsCount !== undefined
        ? pureVegRestaurantsCount
        : (restaurants || []).filter((r) => r.isVeg).length)
    : (count || (restaurants || []).length);

  return (
    <div>
      {loading ? (
        <p>Loading restaurant count...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p className="NumOfRestro">
          {displayCount}
          <span className="Restro">
            {displayCount === 1 ? " restaurant" : " restaurants"}
          </span>
        </p>
      )}
      <hr />
    </div>
  );
};

export default CountRestaurant;
