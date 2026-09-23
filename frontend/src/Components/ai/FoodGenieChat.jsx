import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { askFoodGenie, toggleFoodGenieChat, resetGenieChat } from "../../redux/actions/aiActions";
import { addItemToCart } from "../../redux/actions/cartActions";
import { toast } from "react-toastify";

const QUICK_CHIPS = [
  { label: "🌶️ Spicy under ₹200", prompt: "Suggest something spicy under 200" },
  { label: "🥗 Healthy Pure Veg", prompt: "Recommend pure veg healthy dishes" },
  { label: "🍛 Best Biryani", prompt: "What is the best biryani available?" },
  { label: "🍔 Crispy Fast Food", prompt: "Show me burgers and crispy fast food" },
  { label: "🍨 Sweet Cravings", prompt: "Sweet desserts and treats" },
  { label: "⚡ Evening Chaat", prompt: "Quick evening chaat and snacks" },
];

const FoodGenieChat = () => {
  const dispatch = useDispatch();
  const { isGenieOpen, messages, chatLoading } = useSelector((state) => state.ai || {});
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isGenieOpen) {
      scrollToBottom();
    }
  }, [messages, isGenieOpen, chatLoading]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;
    dispatch(askFoodGenie(query.trim()));
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToCart = (item) => {
    const itemData = {
      _id: item._id,
      name: item.name,
      price: item.price,
      images: [{ url: item.image }],
      stock: 20,
    };
    const restaurantId = item.restaurant?._id || "default_store";
    dispatch(addItemToCart(itemData, 1, restaurantId));
    toast.success(`🧞 Added "${item.name}" from ${item.restaurant?.name || "menu"} to cart!`);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="food_genie_fab"
        className={`food-genie-fab ${isGenieOpen ? "active" : ""}`}
        onClick={() => dispatch(toggleFoodGenieChat(!isGenieOpen))}
        title="Chat with Food Genie AI"
      >
        <span className="genie-icon">🧞</span>
        <span className="genie-fab-text">Food Genie</span>
        <span className="genie-pulse"></span>
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isGenieOpen && (
        <div className="food-genie-container shadow-2xl">
          {/* Header */}
          <div className="genie-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="genie-avatar-badge">🧞</div>
              <div>
                <h5 className="m-0 fw-bold text-white fs-6">Food Genie AI</h5>
                <span className="genie-status-text">Smart Recommendations</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-light py-0 px-2 rounded-pill fs-7"
                onClick={() => dispatch(resetGenieChat())}
                title="Restart Chat"
              >
                🔄 Reset
              </button>
              <button
                className="btn btn-sm btn-light py-0 px-2 rounded-circle fs-6 fw-bold"
                onClick={() => dispatch(toggleFoodGenieChat(false))}
                title="Close Genie"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="genie-chips-bar">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                className="genie-chip-btn"
                onClick={() => handleSend(chip.prompt)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="genie-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`genie-msg-row ${msg.sender === "user" ? "user-row" : "genie-row"}`}
              >
                {msg.sender === "genie" && <span className="genie-chat-avatar">🧞</span>}
                <div className={`genie-bubble ${msg.sender === "user" ? "user-bubble" : "genie-bubble-text"}`}>
                  <p className="m-0">{msg.text}</p>

                  {/* Recommended Dishes Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="genie-cards-grid mt-2">
                      {msg.recommendations.map((item) => (
                        <div key={item._id} className="genie-dish-card shadow-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="genie-dish-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop";
                            }}
                          />
                          <div className="genie-dish-info">
                            <h6 className="genie-dish-title mb-0">{item.name}</h6>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <span className="genie-dish-price">₹{item.price}</span>
                              <span className="genie-dish-rating">★ {item.ratings}</span>
                            </div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>
                              {item.restaurant?.name}
                            </div>
                            <button
                              className="btn btn-sm btn-success w-100 mt-2 py-1 fw-bold genie-add-btn"
                              onClick={() => handleAddToCart(item)}
                            >
                              + Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="genie-msg-row genie-row">
                <span className="genie-chat-avatar">🧞</span>
                <div className="genie-bubble genie-bubble-text typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="genie-chat-footer">
            <div className="input-group">
              <input
                id="genie_input_field"
                type="text"
                className="form-control genie-input"
                placeholder="Ask Food Genie (e.g. Biryani under ₹250)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                id="genie_send_btn"
                className="btn btn-primary genie-send-btn px-3"
                onClick={() => handleSend()}
                disabled={chatLoading || !inputText.trim()}
              >
                Send &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodGenieChat;
