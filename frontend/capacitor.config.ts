import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.sharebite.app',
  appName: 'FoodShare',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
