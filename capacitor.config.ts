import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.muscleworks.dietplan',
  appName: 'Gym Diet Plan Maker',
  webDir: 'dist',
  android: {
    buildOptions: {
      releaseType: 'APK'
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
