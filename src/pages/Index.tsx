
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Calendar, Download, Play, Sparkles, Star, Trophy, Target, Shield, Zap, TrendingUp, Award } from "lucide-react";
import DailyChecklist from "@/components/DailyChecklist";
import EnhancedNavigation from "@/components/EnhancedNavigation";

const Index = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <EnhancedNavigation />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-32 relative z-10">
          <div className="text-center text-white">
            {/* Main Hero Content */}
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="bg-white/20 p-4 sm:p-6 rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl">
                  <img
                    src="/images/logo.png"
                    alt="Muscle Works Logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                  />
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
                Professional
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
                  Diet Plans
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-3 sm:mt-4">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Transform your fitness business with our cutting-edge nutrition planning platform. 
                Create personalized diet plans, track client progress, and scale your success.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="bg-white text-red-600 hover:bg-gray-100 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border-0"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => {
                  setShowDemo(!showDemo);
                  if (!showDemo) {
                    setTimeout(() => {
                      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                {showDemo ? 'Hide Demo' : 'Watch Demo'}
              </Button>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                { number: "10,000+", label: "Diet Plans Created", icon: Target },
                { number: "500+", label: "Professional Trainers", icon: Trophy },
                { number: "98%", label: "Client Satisfaction", icon: Award }
              ].map((stat, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02]">
                  <stat.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-5 text-yellow-300" />
                  <div className="text-4xl sm:text-5xl font-black mb-3 text-white drop-shadow-md">{stat.number}</div>
                  <div className="text-white font-semibold text-base sm:text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {showDemo && (
        <section id="demo" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100">
              <div className="text-center mb-10 sm:mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-16 w-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                    <span className="text-sm text-gray-500 font-medium text-center px-2">Your Logo</span>
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                      Live Demo - Daily Checklist
                    </h2>
                    <p className="text-gray-700 text-lg sm:text-xl mt-2 font-medium">
                      Experience our interactive nutrition tracking system
                    </p>
                  </div>
                </div>
              </div>
              <div className="max-w-4xl mx-auto">
                <DailyChecklist />
              </div>
              <div className="mt-10 sm:mt-12 text-center">
                <p className="text-gray-700 mb-8 text-xl font-medium max-w-2xl mx-auto">
                  This is just one of many powerful features. Join us to unlock everything!
                </p>
                <Button 
                  onClick={() => navigate("/register")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Star className="w-5 h-5 mr-3" />
                  Get Full Access Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block text-red-600 mt-2">Succeed</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Powerful tools designed specifically for fitness professionals who demand excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Users,
                title: "Smart Client Management",
                description: "Organize unlimited clients with advanced filtering, progress tracking, and automated notifications.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Calendar,
                title: "Real-time Progress Tracking",
                description: "Monitor daily nutrition intake with interactive checklists and comprehensive analytics dashboards.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Zap,
                title: "Custom Branding Suite",
                description: "White-label your platform with custom logos, colors, and branding for a professional client experience.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Download,
                title: "Professional PDF Export",
                description: "Generate stunning, branded diet plans and reports that showcase your expertise and professionalism.",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-gray-800 text-center font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-700 text-base sm:text-lg leading-relaxed text-center font-medium">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
              Join thousands of successful trainers who've transformed their business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {[
              {
                quote: "This platform revolutionized how I manage my clients. The professional PDF exports alone are worth the investment.",
                author: "Sarah Johnson",
                title: "Certified Nutritionist",
                rating: 5
              },
              {
                quote: "My client retention increased by 40% since using this system. The branding features make me look incredibly professional.",
                author: "Mike Chen",
                title: "Personal Trainer",
                rating: 5
              },
              {
                quote: "The mobile experience is phenomenal. My clients love the interactive checklists and progress tracking.",
                author: "Emma Rodriguez",
                title: "Wellness Coach",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl mb-6 leading-relaxed italic text-white/90">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-lg">{testimonial.author}</p>
                  <p className="text-red-200">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-8 text-red-500" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
            Ready to Scale Your
            <span className="block text-red-500 mt-2">Fitness Business?</span>
          </h2>
          <p className="text-xl sm:text-2xl mb-10 sm:mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
            Join the elite community of fitness professionals who've doubled their revenue 
            using our advanced nutrition planning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-red-600 hover:bg-red-700 text-white px-10 sm:px-16 py-4 sm:py-6 text-xl sm:text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
            >
              <Star className="w-6 h-6 sm:w-8 sm:h-8 mr-4" />
              Start Your Success Story
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-10 sm:px-16 py-4 sm:py-6 text-xl sm:text-2xl font-bold rounded-2xl"
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-4" />
              Sign In
            </Button>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img
                src="/images/logo.png"
                alt="Muscle Works Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <h3 className="text-2xl sm:text-3xl font-bold">Gym Diet Plan Maker</h3>
            </div>
            <p className="text-gray-300 text-lg sm:text-xl mb-8 font-medium">
              Professional nutrition planning made simple and effective.
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 font-medium">
                © {new Date().getFullYear()} Gym Diet Plan Maker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
