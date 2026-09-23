import api from "../../utils/api";
import {
  getFeaturedBannerRequest,
  getFeaturedBannerSuccess,
  getFeaturedBannerFail,
  addUserMessage,
  genieReplySuccess,
  genieReplyFail,
  toggleGenie,
  clearGenieHistory,
  openAnalyticsModal,
  closeAnalyticsModal,
  getAnalyticsSuccess,
  getAnalyticsFail,
} from "../slices/aiSlice";

// 1. Fetch Featured AI Recommendations for Hero Banner
export const getFeaturedBanner = () => async (dispatch) => {
  try {
    dispatch(getFeaturedBannerRequest());
    const { data } = await api.get("/v1/ai/featured-recommendations");
    dispatch(getFeaturedBannerSuccess(data.recommendations || []));
  } catch (error) {
    dispatch(
      getFeaturedBannerFail(
        error.response?.data?.message || error.message || "Failed to load AI recommendations"
      )
    );
  }
};

// 2. Chat With Food Genie AI
export const askFoodGenie = (userPrompt) => async (dispatch) => {
  try {
    dispatch(addUserMessage(userPrompt));

    const { data } = await api.post(
      "/v1/ai/chat",
      { message: userPrompt },
      { headers: { "Content-Type": "application/json" } }
    );

    dispatch(
      genieReplySuccess({
        reply: data.reply,
        recommendations: data.recommendations || [],
      })
    );
  } catch (error) {
    dispatch(
      genieReplyFail(
        error.response?.data?.message || error.message || "Failed to get response from Food Genie"
      )
    );
  }
};

// 3. Toggle Food Genie Chat Drawer
export const toggleFoodGenieChat = (isOpen) => (dispatch) => {
  dispatch(toggleGenie(isOpen));
};

// 4. Reset Food Genie Conversation
export const resetGenieChat = () => (dispatch) => {
  dispatch(clearGenieHistory());
};

// 5. Fetch Restaurant Review Sentiment Analytics
export const fetchRestaurantAnalytics = (storeId) => async (dispatch) => {
  try {
    dispatch(openAnalyticsModal(storeId));
    const { data } = await api.get(`/v1/ai/restaurant/${storeId}/analytics`);
    dispatch(getAnalyticsSuccess(data.analytics));
  } catch (error) {
    dispatch(
      getAnalyticsFail(
        error.response?.data?.message || error.message || "Failed to load review analytics"
      )
    );
  }
};

// 6. Close Analytics Modal
export const hideAnalyticsModal = () => (dispatch) => {
  dispatch(closeAnalyticsModal());
};
