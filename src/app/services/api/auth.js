import api from "./axiosInstance";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  console.log('Login response:', response);
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

// Thunk action for login with Redux integration
export const loginWithRedux = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: 'auth/loginStart' });
    const data = await login(username, password);
    
    if (data.success) {
      // Store token in localStorage for production compatibility
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
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
    
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    
    dispatch({ type: 'auth/logout' });
    return { success: true };
  } catch (error) {
    // Even if logout API fails, clear local state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    dispatch({ type: 'auth/logout' });
    return { success: false, error: error.message };
  }
};

// Thunk action to check authentication status using getProfile
export const checkAuthStatus = () => async (dispatch) => {
  try {
    dispatch({ type: 'auth/loginStart' });
    const response = await getProfile();
    
    // Check if the response has the expected structure: { success: true, data: { user object } }
    if (response && response.success && response.data) {
      dispatch({
        type: 'auth/restoreAuth',
        payload: {
          user: response.data,
          permissions: [] // Set empty array since permissions aren't included in getProfile response
        }
      });
      return { success: true, user: response.data };
    } else {
      // Handle case where API returns success: false or no user data
      dispatch({ type: 'auth/logout' });
      return { success: false, error: 'Authentication failed' };
    }
  } catch (error) {
    // Log the actual error for debugging
    console.error('checkAuthStatus error:', error);
    dispatch({ type: 'auth/logout' });
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Authentication check failed'
    };
  }
};


