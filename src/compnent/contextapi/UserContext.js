import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  // Initialize mode from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mode') || 'light';
    }
    return 'light';
  });

  const [gmail, setGmail] = useState('');

  // Persist mode changes to localStorage
  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  // Optionally, you can sync dark class here as well, but better in App.js
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  // Toggle between 'light' and 'dark'
  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Explicitly set mode
  const setModeExplicit = (newMode) => {
    setMode(newMode);
  };

  // Update email
  const updateEmail = (newEmail) => setGmail(newEmail);

  return (
    <UserContext.Provider
      value={{
        gmail,
        mode,
        setEmail: updateEmail,
        toggleMode,
        setMode: setModeExplicit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the context easily
export const useUser = () => useContext(UserContext);
