# Weather

A simple weather application built with React Native and Expo.

## Features

- View current weather conditions for any city
- Search for cities using the OpenWeatherMap geocoding API
- Display temperature, weather conditions, humidity, wind speed, and "feels like" temperature

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Get a free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
4. Create a `.env` file in the root directory with your OpenWeatherMap API key:

   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
5. Run the app with `npm run ios` to launch in iOS simulator

## Tech Stack

- React Native
- Expo
- OpenWeatherMap API
- axios for API requests