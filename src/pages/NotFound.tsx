
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img 
          src="/lovable-uploads/5739e01e-5f21-4943-9b4b-dbbccfe35af0.png" 
          alt="Muscle Works Logo" 
          className="h-16 mx-auto mb-4" 
        />
        <h1 className="text-4xl font-bold mb-4 text-muscle-gray">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Link to="/">
          <Button className="bg-muscle-red hover:bg-red-700">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
