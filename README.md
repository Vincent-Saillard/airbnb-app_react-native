# AirBNB mobile copy - React Native

Project done while on BootCamp

## Description

A copy of few screens from AirBNB mobile app
This project contains

- Sign in / Sign up screens, with Token attribution and persistance (storage in mobile memory until user disconnects manually)
- Bottom tabulation : 
  - Home screen displaying offers thanks to FlatList (to avoid mobile app to crash because of memory consumption)
  - Map using geolocation data (app asks for user's premission)
  - User profile page , where user can change profile picture by accessing to his gallery or taking a photo using his camera. He can also modify data such as mail, username and description.
He can also log out, deleting token in mobile memory, he will be redirected to signIn screen automatically.
- Offer's screens with description and minimap, accessible either from Home by clicking on an offer, or from the map by clicking on a pin.

The app is connected to Le Reacteur API and will not be accessible in March 2024.

## Getting Started

If you want to test it on your local server, install needed dependencies with "yarn" and use "yarn dev" command, (app tested on Android)

### Dependencies

- react-native-async-storage
- react-navigation/bottom-tabs
- react-navigation/native
- react-navigation/native-stack
- axios
- expo
- expo-image-picker
- expo-location
- expo-status-bar
- lottie-react-native
- react-native
- react-native-keyboard-aware-scroll-view
- react-native-maps
- react-native-toast-message

### Demo

![ezgif com-video-to-gif-converted](https://github.com/Vincent-Saillard/airbnb-app_react-native/assets/144067650/11b478c5-4305-492f-b160-babee2da4254)

## Authors

Vincent Saillard

- https://www.linkedin.com/in/vincent-saillard-096255a7/
- https://github.com/Vincent-Saillard

Le Reacteur

- https://www.lereacteur.io/

