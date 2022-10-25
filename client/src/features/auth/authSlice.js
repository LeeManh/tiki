import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";

const initialState = {
  status: "idle", // idle || succeeded || failed || loading
  error: null,
  user: {},
  token: "",
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (params, { rejectWithValue }) => {
    try {
      const response = await authApi.login(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await authApi.logout();
  return response.data;
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (params, { rejectWithValue }) => {
    try {
      const response = await authApi.register(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      const { name, avatar, phone, email } = action.payload;

      if (avatar) {
        state.user.avatar = avatar;
      }
      if (name) {
        state.user.name = name;
      }
      if (phone) {
        state.user.phone = phone;
      }
      if (email) {
        state.user.email = email;
      }
    },
    changeRoles: (state, action) => {
      const { roles } = action.payload;
      state.user.roles = roles;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;

        state.status = "succeeded";
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.user = {};
        state.token = "";
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;

        state.status = "succeeded";
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      });
  },
});

export default authSlice.reducer;

export const { clearError, updateUser, changeRoles } = authSlice.actions;

export const selectStatusLogin = (state) => state.auth.status;
export const selectUser = (state) => state.auth.user;
export const selectErrorLogin = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
