import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t py-4 px-6 flex items-center">
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

      <p className="flex-1">A burning itch to know is higher than a solemn vow to persue the truth</p>
      <div className="flex-1"></div>
    </footer>
  );
}
