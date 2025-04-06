import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import ModelDetailsPage from './pages/ModelDetailsPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Components
import ComparisonBar from './components/ComparisonBar';

// Context Providers
import { ComparisonProvider } from './contexts/ComparisonContext';
import { AuthProvider } from './contexts/AuthContext';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#18445c',
      light: '#6e96af',
      dark: '#0a2334',
    },
    secondary: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ComparisonProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/model/:id" element={<ModelDetailsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
          <ComparisonBar />
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 