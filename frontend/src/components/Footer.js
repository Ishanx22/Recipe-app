import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} AI Recipe App. All rights reserved.</p>
    </footer>
  );
}
