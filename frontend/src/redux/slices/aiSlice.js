import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  featuredBanner: [],
  bannerLoading: false,
  bannerError: null,

  // Food Genie chat state
  isGenieOpen: false,
  messages: [
    {
      id: "welcome",
      sender: "genie",
      text: "Hello! I am Food Genie 🧞✨ What are you craving today? Ask me for budget-friendly meals, spicy treats, desserts, or the best Biryani in town!",
      recommendations: [],
    },
  ],
  chatLoading: false,
  chatError: null,

  // Restaurant review analytics modal state
  activeAnalyticsRestaurantId: null,
  analyticsData: null,
  analyticsLoading: false,
  analyticsError: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    // Featured Recommendations
    getFeaturedBannerRequest: (state) => {
      state.bannerLoading = true;
      state.bannerError = null;
    },
    getFeaturedBannerSuccess: (state, action) => {
      state.bannerLoading = false;
      state.featuredBanner = action.payload;
    },
    getFeaturedBannerFail: (state, action) => {
      state.bannerLoading = false;
      state.bannerError = action.payload;
    },

    // Food Genie Chat
    toggleGenie: (state, action) => {
      state.isGenieOpen = typeof action.payload === "boolean" ? action.payload : !state.isGenieOpen;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        sender: "user",
        text: action.payload,
      });
      state.chatLoading = true;
      state.chatError = null;
    },
    genieReplySuccess: (state, action) => {
      state.chatLoading = false;
      state.messages.push({
        id: (Date.now() + 1).toString(),
        sender: "genie",
        text: action.payload.reply,
        recommendations: action.payload.recommendations || [],
      });
    },
    genieReplyFail: (state, action) => {
      state.chatLoading = false;
      state.chatError = action.payload;
      state.messages.push({
        id: (Date.now() + 1).toString(),
        sender: "genie",
        text: "Oops! Food Genie had a hiccup searching the kitchens. Please try again! 🧞⚠️",
        recommendations: [],
      });
    },
    clearGenieHistory: (state) => {
      state.messages = [
        {
          id: "welcome",
          sender: "genie",
          text: "Hello! I am Food Genie 🧞✨ What are you craving today? Ask me for budget-friendly meals, spicy treats, desserts, or the best Biryani in town!",
          recommendations: [],
        },
      ];
    },

    // Analytics Modal
    openAnalyticsModal: (state, action) => {
      state.activeAnalyticsRestaurantId = action.payload;
      state.analyticsLoading = true;
      state.analyticsError = null;
      state.analyticsData = null;
    },
    closeAnalyticsModal: (state) => {
      state.activeAnalyticsRestaurantId = null;
      state.analyticsData = null;
      state.analyticsLoading = false;
    },
    getAnalyticsSuccess: (state, action) => {
      state.analyticsLoading = false;
      state.analyticsData = action.payload;
    },
    getAnalyticsFail: (state, action) => {
      state.analyticsLoading = false;
      state.analyticsError = action.payload;
    },
  },
});

export const {
  getFeaturedBannerRequest,
  getFeaturedBannerSuccess,
  getFeaturedBannerFail,
  toggleGenie,
  addUserMessage,
  genieReplySuccess,
  genieReplyFail,
  clearGenieHistory,
  openAnalyticsModal,
  closeAnalyticsModal,
  getAnalyticsSuccess,
  getAnalyticsFail,
} = aiSlice.actions;

export default aiSlice.reducer;
