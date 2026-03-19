import { createRoot } from "react-dom/client";
import { Component, ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    constructor(props: { children: ReactNode }) {
          super(props);
          this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
          return { error };
    }
    render() {
          if (this.state.error) {
                  return (
                            <div style={{ padding: 40, fontFamily: "monospace", background: "#1a0000", color: "#ff6666", minHeight: "100vh" }}>
                                        <h1 style={{ color: "#ff4444" }}>App Error</h1>h1>
                                        <p><strong>{this.state.error.message}</strong>strong></p>p>
                                      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{this.state.error.stack}</pre>pre>
                            </div>div>
                          );
          }
          return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>ErrorBoundary>
  );</p>
