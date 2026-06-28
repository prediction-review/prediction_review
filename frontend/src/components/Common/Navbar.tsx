import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
  <div className="flex flex-row">
    <Link to="/" className="px-4">Home</Link>
    <Link to="/about" className="px-4">About</Link>
  </div>
  );
}
