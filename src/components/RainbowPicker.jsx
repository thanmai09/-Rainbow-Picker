import { useState, useEffect } from "react";
import "./RainbowPicker.css";

// SVG Vectors for the Click-to-Copy interaction feedback
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function RainbowPicker() {
  const colors = [
    { name: "RED", code: "#FF4D4D" },
    { name: "ORANGE", code: "#FF944D" },
    { name: "YELLOW", code: "#FFD633" },
    { name: "GREEN", code: "#66CC66" },
    { name: "BLUE", code: "#4DA6FF" },
    { name: "INDIGO", code: "#6666FF" },
    { name: "VIOLET", code: "#CC99FF" },
    { name: "RAINBOW", code: "RAINBOW" }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const selectedColor = colors[selectedIndex];

  // Side-effect to automatically update history list (max 5 items, no duplicates, animated)
  useEffect(() => {
    const color = colors[selectedIndex];
    setHistory((prev) => {
      // Don't append if it's the exact same color selection consecutively
      if (prev.length > 0 && prev[0].name === color.name) {
        return prev;
      }
      // Keep colors unique in the history row to animate transitions cleanly
      const filtered = prev.filter((item) => item.name !== color.name);
      return [color, ...filtered].slice(0, 5);
    });
  }, [selectedIndex]);

  // Window event listener for keyboard Left/Right arrow cycling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % colors.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + colors.length) % colors.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Utility to handle clipboard copying with modern navigator API
  const handleCopy = () => {
    let textToCopy = selectedColor.code;
    if (selectedColor.name === "RAINBOW") {
      textToCopy =
        "linear-gradient(90deg, #FF4D4D, #FF944D, #FFD633, #66CC66, #4DA6FF, #6666FF, #CC99FF)";
    }
    navigator.clipboard.writeText(textToCopy.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Re-activate a color from the history swatches
  const handleHistoryClick = (color) => {
    const index = colors.findIndex((c) => c.name === color.name);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  return (
    <div
      className={`app-container ${selectedColor.name === "RAINBOW" ? "is-rainbow" : ""}`}
      style={
        selectedColor.name !== "RAINBOW"
          ? { "--active-color": selectedColor.code }
          : {}
      }
    >
      <div className="card">
        <header className="card-header">
          <h1 className="title">🌈 Rainbow Picker</h1>
          <p className="subtitle">Modern Design Color Palette Swatch</p>
        </header>

        {/* Selected Color Information Panel */}
        <div className="info-display">
          <div className="info-group">
            <span className="info-title">Selected Color</span>
            <h2 key={selectedColor.name} className="color-name slide-up-animation">
              {selectedColor.name}
            </h2>
          </div>

          <div
            className={`hex-badge ${selectedColor.name === "RAINBOW" ? "is-rainbow-hex" : ""}`}
            onClick={handleCopy}
            title={selectedColor.name === "RAINBOW" ? "Copy Gradient CSS" : "Copy HEX Code"}
          >
            <span className="hex-label">HEX</span>
            <span key={selectedColor.code} className="hex-value slide-up-animation">
              {selectedColor.name === "RAINBOW" ? "GRADIENT" : selectedColor.code}
            </span>
            <div className="icon-wrapper">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </div>
            
            {/* Smooth dynamic tooltip */}
            <span className={`tooltip ${copied ? "is-visible" : ""}`}>
              {copied ? "Copied!" : "Click to Copy"}
            </span>
          </div>
        </div>

        {/* Primary Color Swatch Selector Row */}
        <div className="button-group">
          {colors.map((color, idx) => (
            <button
              key={color.name}
              className={`color-btn ${idx === selectedIndex ? "is-active" : ""} ${
                color.name === "RAINBOW" ? "is-rainbow-btn" : ""
              }`}
              style={color.name !== "RAINBOW" ? { backgroundColor: color.code } : {}}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select color ${color.name}`}
            >
              <span className="btn-label">{color.name.charAt(0)}</span>
            </button>
          ))}
        </div>

        {/* Recent Selections History Swatches */}
        {history.length > 0 && (
          <div className="history-container">
            <h3 className="history-title">Recent Selections</h3>
            <div className="history-row">
              {history.map((color, idx) => (
                <button
                  key={`${color.name}-${idx}`}
                  className={`history-swatch ${color.name === "RAINBOW" ? "is-rainbow-swatch" : ""}`}
                  style={color.name !== "RAINBOW" ? { backgroundColor: color.code } : {}}
                  onClick={() => handleHistoryClick(color)}
                  title={`Select ${color.name}`}
                  aria-label={`Select ${color.name}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Keyboard cycling controls legend */}
        <footer className="card-footer">
          <div className="keyboard-legend">
            Navigate with <kbd>←</kbd> <kbd>→</kbd> keys
          </div>
        </footer>
      </div>
    </div>
  );
}

export default RainbowPicker;