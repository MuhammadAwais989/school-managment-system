// Activities.Context.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ActivitiesContext = createContext();

const loadActivitiesFromStorage = () => {
  try {
    const stored = localStorage.getItem('school_activities');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading activities from storage:', error);
    return [];
  }
};

const saveActivitiesToStorage = (activities) => {
  try {
    localStorage.setItem('school_activities', JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activities to storage:', error);
  }
};

const activitiesReducer = (state, action) => {
  let newActivities;
  
  switch (action.type) {
    case 'ADD_ACTIVITY':
      newActivities = [action.payload, ...state.activities].slice(0, 50);
      saveActivitiesToStorage(newActivities);
      return {
        ...state,
        activities: newActivities
      };
    case 'LOAD_ACTIVITIES':
      return {
        ...state,
        activities: action.payload
      };
    case 'CLEAR_ACTIVITIES':
      saveActivitiesToStorage([]);
      return {
        ...state,
        activities: []
      };
    default:
      return state;
  }
};

const initialState = {
  activities: []
};

export const ActivitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(activitiesReducer, initialState);

  // Component mount hone par activities load karein
  useEffect(() => {
    const storedActivities = loadActivitiesFromStorage();
    dispatch({
      type: 'LOAD_ACTIVITIES',
      payload: storedActivities
    });
  }, []);

  // ✅ AUTOMATIC LOGIN/LOGOUT TRACKING
  useEffect(() => {
    const handleLoginActivity = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userName = localStorage.getItem('userName') || 'Unknown User';
      const userEmail = localStorage.getItem('userEmail') || 'Unknown Email';

      if (token && role && userName) {
        // Check if login activity already exists for this session
        const existingActivity = state.activities.find(
          activity => 
            activity.type === 'login' && 
            activity.user === userName &&
            new Date(activity.timestamp).toDateString() === new Date().toDateString()
        );

        if (!existingActivity) {
          const loginActivity = {
            id: Date.now() + Math.random(),
            type: 'login',
            title: 'User Login',
            description: `${userName} (${role}) logged into the system`,
            user: userName,
            timestamp: new Date(),
            metadata: {
              role: role,
              email: userEmail,
              loginTime: new Date().toLocaleTimeString()
            }
          };

          dispatch({
            type: 'ADD_ACTIVITY',
            payload: loginActivity
          });
        }
      }
    };

    // Page load par check karein koi user logged in hai ya nahi
    setTimeout(handleLoginActivity, 1000);
  }, [state.activities]);

  const addActivity = (activity) => {
    const completeActivity = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...activity
    };
    
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: completeActivity
    });
  };

  const clearActivities = () => {
    dispatch({ type: 'CLEAR_ACTIVITIES' });
  };

  return (
    <ActivitiesContext.Provider value={{
      activities: state.activities,
      addActivity,
      clearActivities
    }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within ActivitiesProvider');
  }
  return context;
};