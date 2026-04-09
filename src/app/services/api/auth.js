import api from "./axiosInstance";
import { setAccessToken, clearAccessToken } from "./axiosInstance";

export const login = async (username, password, branch_id, rememberMe = false) => {
  const response = await api.post("/auth/login", { username, password, branch_id, rememberMe });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

// Thunk action for login with Redux integration
export const loginWithRedux = (username, password, branch_id, rememberMe = false) => async (dispatch) => {
  try {
    dispatch({ type: 'auth/loginStart' });
    const data = await login(username, password, branch_id, rememberMe);
    
    if (data.success) {
      // Store access token in memory only (not localStorage, not cookies)
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      
      dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: data.user,
          permissions: data.permissions
        }
      });
      
      return { success: true, data };
    } else {
      dispatch({
        type: 'auth/loginFailure',
        payload: data.message || 'Login failed'
      });
      return { success: false, error: data.message };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    dispatch({
      type: 'auth/loginFailure',
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

// Thunk action for logout with Redux integration
export const logoutWithRedux = () => async (dispatch) => {
  try {
    await logout();
  } catch (error) {
    // Even if API call fails, still clear local state
  }
  
  clearAccessToken();
  dispatch({ type: 'auth/logout' });
  return { success: true };
};

// Thunk: Check auth on app load — try silent refresh using httpOnly cookie
export const checkAuthStatus = () => async (dispatch) => {
  try {
    dispatch({ type: 'auth/loginStart' });

    // Try to get a new access token via the refresh cookie
    const refreshResult = await refreshToken();
    
    if (refreshResult.success && refreshResult.accessToken) {
      setAccessToken(refreshResult.accessToken);
    } else {
      dispatch({ type: 'auth/logout' });
      return { success: false, error: 'No valid session' };
    }

    // Now fetch the user profile with the fresh access token
    const response = await getProfile();
    
    if (response && response.success && response.data) {
      dispatch({
        type: 'auth/restoreAuth',
        payload: {
          user: response.data,
          permissions: response.permissions || []
        }
      });
      return { success: true, user: response.data };
    } else {
      dispatch({ type: 'auth/logout' });
      return { success: false, error: 'Authentication failed' };
    }
  } catch (error) {
    clearAccessToken();
    dispatch({ type: 'auth/logout' });
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Authentication check failed'
    };
  }
};