import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ComparisonContext = createContext();

// Maximum number of models that can be compared
const MAX_COMPARISON_MODELS = 4;

// Provider component that wraps the app
export const ComparisonProvider = ({ children }) => {
  // State for models selected for comparison
  const [comparisonModels, setComparisonModels] = useState([]);
  const [showComparisonBar, setShowComparisonBar] = useState(false);
  
  // Load comparison models from localStorage on mount
  useEffect(() => {
    try {
      const savedModels = localStorage.getItem('comparisonModels');
      if (savedModels) {
        setComparisonModels(JSON.parse(savedModels));
      }
    } catch (error) {
      console.error('Error loading comparison models from localStorage:', error);
    }
  }, []);
  
  // Save comparison models to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('comparisonModels', JSON.stringify(comparisonModels));
      // Show comparison bar if there are models to compare
      setShowComparisonBar(comparisonModels.length > 0);
    } catch (error) {
      console.error('Error saving comparison models to localStorage:', error);
    }
  }, [comparisonModels]);
  
  // Add a model to comparison
  const addModelToComparison = (model) => {
    try {
      // Validate input
      if (!model || !model.id) {
        console.warn('Invalid model provided to comparison');
        return { success: false, message: 'Invalid model data' };
      }
      
      // Check if model is already in comparison
      if (comparisonModels.some(m => m.id === model.id)) {
        return { success: false, message: 'Model already added to comparison' };
      }
      
      // Check if maximum models reached
      if (comparisonModels.length >= MAX_COMPARISON_MODELS) {
        return { 
          success: false, 
          message: `You can compare a maximum of ${MAX_COMPARISON_MODELS} models. Remove one to add another.` 
        };
      }
      
      // Add model to comparison
      setComparisonModels([...comparisonModels, model]);
      return { success: true, message: 'Model added to comparison' };
    } catch (error) {
      console.error('Error adding model to comparison:', error);
      return { success: false, message: 'Failed to add model to comparison' };
    }
  };
  
  // Remove a model from comparison
  const removeModelFromComparison = (modelId) => {
    try {
      if (!modelId && modelId !== 0) {
        console.warn('Invalid model ID provided for removal');
        return { success: false, message: 'Invalid model ID' };
      }
      
      setComparisonModels(comparisonModels.filter(model => model.id !== modelId));
      return { success: true, message: 'Model removed from comparison' };
    } catch (error) {
      console.error('Error removing model from comparison:', error);
      return { success: false, message: 'Failed to remove model from comparison' };
    }
  };
  
  // Clear all models from comparison
  const clearComparison = () => {
    setComparisonModels([]);
    return { success: true, message: 'Comparison cleared' };
  };
  
  // Check if a model is in comparison
  const isModelInComparison = (modelId) => {
    return comparisonModels.some(model => model.id === modelId);
  };
  
  // Get number of available slots
  const getAvailableSlots = () => {
    return MAX_COMPARISON_MODELS - comparisonModels.length;
  };
  
  // The context value
  const value = {
    comparisonModels,
    addModelToComparison,
    removeModelFromComparison,
    clearComparison,
    isModelInComparison,
    getAvailableSlots,
    showComparisonBar,
    setShowComparisonBar,
    MAX_COMPARISON_MODELS
  };
  
  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

// Custom hook to use the comparison context
export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export default ComparisonContext; 