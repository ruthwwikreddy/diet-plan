
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, User, Save, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TrainerProfile = () => {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gymName, setGymName] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#E31B23');
  const [secondaryColor, setSecondaryColor] = useState('#4D4D4D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user?.id);
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
        setLogoUrl(data.logo_url);
        setPrimaryColor(data.primary_color || '#E31B23');
        setSecondaryColor(data.secondary_color || '#4D4D4D');
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log('Starting logo upload...');
      
      if (!event.target.files || event.target.files.length === 0) {
        console.log('No file selected');
        return;
      }

      const file = event.target.files[0];
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('trainer-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('trainer-assets')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);

      setLogoUrl(urlData.publicUrl);
      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error(`Error uploading logo: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-red-600" />
          Trainer Profile & Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="trainerName">Trainer Name</Label>
            <Input
              id="trainerName"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="gymName">Gym/Business Name</Label>
            <Input
              id="gymName"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              placeholder="Enter your gym or business name"
            />
          </div>

          <div>
            <Label>Brand Colors</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="primaryColor" className="text-sm text-gray-600">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#E31B23"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor" className="text-sm text-gray-600">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="#4D4D4D"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex items-center gap-1"
              >
                <Palette className="w-3 h-3" />
                Reset to Default
              </Button>
            </div>
            <div className="mt-3 p-3 border rounded-lg bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Color Preview:</p>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: primaryColor }}
                  title="Primary Color"
                ></div>
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: secondaryColor }}
                  title="Secondary Color"
                ></div>
              </div>
            </div>
          </div>

          <div>
            <Label>Logo Upload</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Trainer Logo"
                    className="max-w-32 max-h-32 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="w-20 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center mb-2">
                      <span className="text-xs text-center px-2">Your Logo</span>
                    </div>
                    <p className="text-sm">No logo uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Upload className="w-6 h-6 mb-1 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> your logo
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {uploading && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-red-500">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          disabled={uploading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Profile & Branding
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainerProfile;
