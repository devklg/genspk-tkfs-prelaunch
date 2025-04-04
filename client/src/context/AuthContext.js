import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Auth provider implementation will go here
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}; 