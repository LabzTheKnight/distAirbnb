module.exports = {
  name: 'Dist_Airbnb',
  slug: 'Dist_Airbnb',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'distairbnb',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png'
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    authUrl: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:8001/api/auth',
    listingUrl: process.env.EXPO_PUBLIC_LISTING_URL || 'http://localhost:5000/api'
  }
};
