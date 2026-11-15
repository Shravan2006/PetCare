import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🐾 PetCare</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/appointments">Appointments</Link>
      </div>
    </nav>
  );
}

export default Navbar;