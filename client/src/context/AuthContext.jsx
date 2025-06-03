import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();


const API_BASE_URL = "http://localhost:5001/api";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;


const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  
  useEffect(() => {
    checkAuthStatus();
  }, []);

  
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          error.response?.data?.code === "TOKEN_EXPIRED" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            await refreshToken();
            return axios(originalRequest);
          } catch (refreshError) {
            dispatch({ type: "LOGOUT" });
            window.location.href = "/signin";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get("/user/profile");

      if (response.data.success) {
        dispatch({ type: "SET_USER", payload: response.data.user });
      }
    } catch (error) {
      
      try {
        await refreshToken();
        const response = await axios.get("/user/profile");
        if (response.data.success) {
          dispatch({ type: "SET_USER", payload: response.data.user });
        }
      } catch (refreshError) {
        dispatch({ type: "LOGOUT" });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/auth/refresh");
      if (response.data.success) {
        return response.data;
      }
      throw new Error("Token refresh failed");
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await axios.post("/auth/signup", userData);

      if (response.data.success) {
        dispatch({ type: "SET_USER", payload: response.data.user });
        toast.success("Account created successfully!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signin = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await axios.post("/auth/signin", credentials);

      if (response.data.success) {
        dispatch({ type: "SET_USER", payload: response.data.user });
        toast.success("Login successful!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
    }
  };

  const verifyShopAccess = async (shopName) => {
    try {
      const response = await axios.get(`/user/verify-shop/${shopName}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    ...state,
    signup,
    signin,
    logout,
    verifyShopAccess,
    checkAuthStatus,
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
