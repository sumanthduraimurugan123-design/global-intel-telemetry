import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL REACT APP CRASH:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0F0E0C',
          color: '#D4CFCB',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            border: '1px solid #B83030',
            backgroundColor: '#1E1C19',
            borderRadius: '6px',
            padding: '24px'
          }}>
            <h1 style={{ color: '#B83030', fontSize: '1.4rem', marginBottom: '12px' }}>
              Application Error (Telemetry Interface)
            </h1>
            <p style={{ marginBottom: '16px', color: '#8C8580', fontSize: '0.9rem' }}>
              A runtime error occurred while rendering the dashboard.
            </p>
            <div style={{
              backgroundColor: '#0F0E0C',
              padding: '16px',
              borderRadius: '4px',
              color: '#FF6B6B',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              marginBottom: '16px',
              border: '1px solid #2C2A26'
            }}>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#C9A24A',
                color: '#0F0E0C',
                border: 'none',
                padding: '8px 16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

