/**
 * ModelLoaderProvider — NyayaSetu
 * Provides model status context to the entire app.
 * No longer blocks rendering — the app is always accessible.
 * Model download is triggered manually by the user.
 */
import React from 'react';
import { useModelLoader } from '../hooks/useModelLoader.js';

export const ModelStatusContext = React.createContext(null);

export function useModelStatus() {
  return React.useContext(ModelStatusContext);
}

export function ModelLoaderProvider({ children }) {
  const loader = useModelLoader();

  return (
    <ModelStatusContext.Provider value={loader}>
      {children}
    </ModelStatusContext.Provider>
  );
}
