import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ActivitiesContext = createContext();

// Local storage se activities load karne ka function
const loadActivitiesFromStorage = () => {
  try {
    const stored = localStorage.getItem('school_activities');
    if (stored) {
      const activities = JSON.parse(stored);
      console.log("📥 Loaded activities from storage:", activities.length);
      return activities;
    }
    return [];
  } catch (error) {
    console.error('Error loading activities from storage:', error);
    return [];
  }
};

// Local storage mein save karne ka function
const saveActivitiesToStorage = (activities) => {
  try {
    localStorage.setItem('school_activities', JSON.stringify(activities));
    console.log("💾 Saved activities to storage:", activities.length);
  } catch (error) {
    console.error('Error saving activities to storage:', error);
  }
};

const activitiesReducer = (state, action) => {
  let newActivities;
  
  switch (action.type) {
    case 'ADD_ACTIVITY':
      newActivities = [action.payload, ...state.activities].slice(0, 50); // Last 50 activities
      saveActivitiesToStorage(newActivities);
      console.log("➕ Added new activity:", action.payload);
      return {
        ...state,
        activities: newActivities
      };
    case 'LOAD_ACTIVITIES':
      console.log("🔄 Loading activities into state");
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
    console.log("🎯 ActivitiesProvider mounted");
    const storedActivities = loadActivitiesFromStorage();
    dispatch({
      type: 'LOAD_ACTIVITIES',
      payload: storedActivities
    });
  }, []);

  const addActivity = (activity) => {
    // Ensure activity has all required fields
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