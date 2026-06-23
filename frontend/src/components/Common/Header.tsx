import logo from "@/assets/Logo.png";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b py-6 px-6 bg-secondary flex items-center">
      {/* LOGO */}
      <div className="flex-1 flex justify-start items-centerw-auto h-16">
        <Link to="/" className="flex h-full items-center">
          <img src={logo} alt="Prediction Review" className="h-full w-auto" />
        </Link>
      </div>

      {/* title */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <Link to="/">
          <div className="justify-center items-start">
            <span className="text-xl text-foreground">Prediction</span>
            <br />
            <span className="text-xl text-foreground">
              <strong>Review</strong>
            </span>
          </div>
        </Link>
      </div>

      {/* navbar */}
      <div className="flex-1 flex justify-end">NAVBAR</div>
    </header>
  );
}
