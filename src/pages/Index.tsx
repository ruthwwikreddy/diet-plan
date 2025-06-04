
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Calendar, Download } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-sm text-gray-500">Your Logo</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Gym Diet Plan Maker</h1>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Diet Plans
            <span className="block text-red-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create customized diet plans for your clients with our professional platform. 
            Track progress, manage nutrition, and build your fitness business with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 rounded-lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base">
                Organize and track all your clients' diet plans in one centralized dashboard.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">Daily Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base">
                Monitor daily progress with interactive checklists and nutrition tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">Custom Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base">
                Personalize with your logo and brand colors for a professional experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-800">PDF Export</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base">
                Generate professional PDF diet plans with your branding for clients.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of fitness professionals who trust our platform to create 
            professional diet plans and grow their business.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/register")}
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Gym Diet Plan Maker. Professional nutrition planning made simple.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
