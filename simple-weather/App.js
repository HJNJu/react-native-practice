import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';


const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: {latitude, longitude},
    } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps: false}
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator
              color="#dfdfdf"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const dateString = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            return (
              <View key={index} style={styles.day}>
              <Text style={styles.tinyText}>{dateString}</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}°</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Fontisto name={icons[day.weather[0].main]} size={24} color="black" />
                <Text style={styles.description}>{day.weather[0].main}</Text>
              </View>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
            )
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1f1fc",
  },
  city: {
    flex: 1.1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 55,
    fontWeight: "500",
    color: "black",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  temp: {
    fontWeight: "600",
    fontSize: 100,
    color: "black",
  },
  description: {
    marginLeft: 10,
    fontSize: 30,
    color: "black",
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 25,
    color: "black",
    fontWeight: "500",
  },
})