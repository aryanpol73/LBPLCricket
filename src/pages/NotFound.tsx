import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "linear-gradient(to bottom, #0b1c3d, #081428)" }}
    >
      <div className="text-center max-w-md">
        <h1 className="mb-2 text-6xl font-extrabold text-[#f0b429]">404</h1>
        <p className="mb-6 text-lg text-gray-300">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#f0b429] text-[#0b1c3d] font-semibold hover:opacity-90 transition active:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
