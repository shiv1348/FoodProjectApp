import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedBanner } from "../../redux/actions/aiActions";
import { addItemToCart } from "../../redux/actions/cartActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AIRecommendationBanner = () => {
  const dispatch = useDispatch();
  const { featuredBanner, bannerLoading } = useSelector((state) => state.ai || {});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getFeaturedBanner());
  }, [dispatch]);

  // Auto rotate banner every 6 seconds
  useEffect(() => {
    if (!featuredBanner || featuredBanner.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBanner.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredBanner]);

  if (bannerLoading || !featuredBanner || featuredBanner.length === 0) {
    return null;
  }

  const currentItem = featuredBanner[currentIndex];
  if (!currentItem) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const itemData = {
      _id: currentItem._id,
      name: currentItem.name,
      price: currentItem.price,
      images: [{ url: currentItem.image }],
      stock: 20,
    };
    const restaurantId = currentItem.restaurant?._id || "default_store";
    dispatch(addItemToCart(itemData, 1, restaurantId));
    toast.success(`✨ Added "${currentItem.name}" to cart!`);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? featuredBanner.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredBanner.length);
  };

  return (
    <div className="container my-3">
      <div className="ai-hero-banner shadow-lg position-relative overflow-hidden rounded-4">
        {/* Decorative background aura */}
        <div className="ai-banner-glow"></div>

        <div className="row align-items-center g-4 p-4 position-relative z-2">
          {/* Left Text / Promo Section */}
          <div className="col-12 col-md-7 text-white">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge ai-pill-badge px-3 py-2 text-uppercase fw-bold">
                ✨ AI Recommendation For You
              </span>
              <span
                className="badge px-3 py-2 text-white fw-bold"
                style={{ backgroundColor: currentItem.badgeColor || "#ff4757" }}
              >
                {currentItem.tag}
              </span>
            </div>

            <h2 className="display-6 fw-bold mb-1 text-white">{currentItem.name}</h2>
            <p className="ai-flavor-text text-warning fw-semibold fs-5 mb-2">
              "{currentItem.highlight}"
            </p>

            <p className="ai-desc text-light opacity-75 small mb-3 line-clamp-2">
              {currentItem.description}
            </p>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <span className="fs-3 fw-bold text-white">₹{currentItem.price}</span>

              {currentItem.restaurant && (
                <span className="text-light opacity-90 small">
                  From: <strong>{currentItem.restaurant.name}</strong> (★ {currentItem.restaurant.ratings})
                </span>
              )}

              <button
                id="ai_order_now_btn"
                className="btn btn-warning px-4 py-2 fw-bold text-dark rounded-pill shadow-sm ai-pulse-btn"
                onClick={handleAddToCart}
              >
                ⚡ Order Now &bull; Add to Cart
              </button>

              {currentItem.restaurant?._id && (
                <Link
                  to={`/eats/stores/${currentItem.restaurant._id}/menus`}
                  className="btn btn-outline-light btn-sm rounded-pill px-3 py-2"
                >
                  View Menu &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="col-12 col-md-5 text-center position-relative">
            <div className="ai-banner-img-wrapper">
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className="img-fluid rounded-4 shadow-lg ai-banner-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
                }}
              />
              <div className="ai-rating-float-badge">
                ★ {currentItem.ratings}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        {featuredBanner.length > 1 && (
          <div className="ai-carousel-controls">
            <button className="ai-nav-arrow prev-arrow" onClick={handlePrev} title="Previous recommendation">
              &#10094;
            </button>
            <div className="ai-dots">
              {featuredBanner.slice(0, 6).map((_, i) => (
                <span
                  key={i}
                  className={`ai-dot ${i === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
            <button className="ai-nav-arrow next-arrow" onClick={handleNext} title="Next recommendation">
              &#10095;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationBanner;
