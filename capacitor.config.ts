import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitcontrol.app',   // tu id de paquete
  appName: 'fitcontrol-web-starter',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
