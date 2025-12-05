import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("React Error Boundary Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "2rem",
          background: "#fee2e2",
          borderRadius: "10px",
          color: "#b91c1c",
          border: "1px solid #fecaca"
        }}>
          <h2>⚠️ Something went wrong.</h2>
          <p>Please refresh or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
