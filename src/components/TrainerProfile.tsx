import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, Palette, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TrainerProfile = () => {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [gymName, setGymName] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#E31B23');
  const [secondaryColor, setSecondaryColor] = useState('#4D4D4D');
  const [loading, setLoading] = useState(true);

  const availableLogos = [
    '/images/gym-logos/MuscleWorks.png'
  ];
  
  // Add an option for no logo
  const logoOptions = [
    { url: null, label: 'No Logo' },
    ...availableLogos.map(url => ({ url, label: url.split('/').pop() }))
  ];

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user?.id);
      
      // Try to get from localStorage first
      const localLogo = localStorage.getItem(`trainer_logo_${user?.id}`);
      if (localLogo) {
        setLogoUrl(localLogo);
      }
      
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('trainer_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data);
        setGymName(data.gym_name || '');
        setTrainerName(data.trainer_name || user?.name || '');
        setPrimaryColor(data.primary_color || '#E31B23');
        setSecondaryColor(data.secondary_color || '#4D4D4D');
        
        // Use database logo if no local logo exists
        if (!localLogo && data.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } else {
        console.log('No profile found, using defaults');
        setTrainerName(user?.name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const selectLogo = (logoUrl: string | null) => {
    setLogoUrl(logoUrl);
    // Store in localStorage
    if (logoUrl) {
      localStorage.setItem(`trainer_logo_${user?.id}`, logoUrl);
    } else {
      localStorage.removeItem(`trainer_logo_${user?.id}`);
    }
    toast.success(logoUrl ? 'Logo selected!' : 'Logo removed');
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile...');
      const profileData = {
        trainer_id: user?.id,
        trainer_name: trainerName,
        gym_name: gymName,
        logo_url: logoUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        updated_at: new Date().toISOString()
      };

      console.log('Profile data to save:', profileData);

      const { error } = await supabase
        .from('trainer_profiles')
        .upsert(profileData, {
          onConflict: 'trainer_id'
        });

      if (error) {
        console.error('Save error:', error);
        throw error;
      }

      console.log('Profile saved successfully');
      toast.success('Profile saved successfully!');
      
      // Update CSS custom properties for immediate effect
      document.documentElement.style.setProperty('--trainer-primary', primaryColor);
      document.documentElement.style.setProperty('--trainer-secondary', secondaryColor);
      
      // Store colors in localStorage for instant loading
      localStorage.setItem(`trainer_colors_${user?.id}`, JSON.stringify({
        primary: primaryColor,
        secondary: secondaryColor
      }));
      
      // Trigger a page refresh to update the layout
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(`Error saving profile: ${error.message || 'Unknown error'}`);
    }
  };

  const resetToDefault = () => {
    setPrimaryColor('#E31B23');
    setSecondaryColor('#4D4D4D');
  };

  const removeLogo = () => {
    setLogoUrl(null);
    localStorage.removeItem(`trainer_logo_${user?.id}`);
    toast.success('Logo removed');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="h-6 w-6 text-red-600" />
          Trainer Profile & Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="trainerName" className="text-lg font-semibold">Trainer Name</Label>
              <Input
                id="trainerName"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2 text-lg p-4"
              />
            </div>

            <div>
              <Label htmlFor="gymName" className="text-lg font-semibold">Gym/Business Name</Label>
              <Input
                id="gymName"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="Enter your gym or business name"
                className="mt-2 text-lg p-4"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Brand Colors</Label>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <Label htmlFor="primaryColor" className="text-sm text-gray-600 font-medium">Primary Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-12 p-2 border-2 rounded-lg"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#E31B23"
                      className="flex-1 text-lg p-3"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor" className="text-sm text-gray-600 font-medium">Secondary Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-20 h-12 p-2 border-2 rounded-lg"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#4D4D4D"
                      className="flex-1 text-lg p-3"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefault}
                  className="flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Reset to Default
                </Button>
              </div>
              <div className="mt-4 p-4 border-2 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-600 mb-3 font-medium">Color Preview:</p>
                <div className="flex gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: primaryColor }}
                    title="Primary Color"
                  ></div>
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: secondaryColor }}
                    title="Secondary Color"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-lg font-semibold">Choose Your Logo</Label>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              {logoUrl ? (
                <div className="text-center">
                  <img
                    src={logoUrl}
                    alt="Selected Logo"
                    className="max-w-40 max-h-32 object-contain mx-auto mb-4 rounded-lg shadow-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    Remove Logo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-24 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-sm text-center px-2">Your Logo</span>
                  </div>
                  <p className="text-lg font-medium">No logo selected</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-4">Available Logos:</h3>
              <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {logoOptions.map((logo, index) => (
                  <div 
                    key={index}
                    onClick={() => selectLogo(logo.url)}
                    className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all ${logoUrl === logo.url ? 'border-muscle-red ring-2 ring-muscle-red/50' : 'border-gray-200 hover:border-muscle-red/50'} ${!logo.url ? 'h-20 flex items-center justify-center' : ''}`}
                  >
                    {logo.url ? (
                      <img 
                        src={logo.url} 
                        alt={logo.label} 
                        className="h-16 w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Logo</span>
                    )}
                    {logoUrl === logo.url && (
                      <div className="absolute -top-2 -right-2 bg-muscle-red text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {logoUrl ? 'Selected logo will appear in your diet plans' : 'No logo will be shown in your diet plans'}
              </p>
            </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Profile & Branding
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainerProfile;
