import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function AroundMeScreen() {
  const navigation = useNavigation();
  console.log(navigation);
  const animation = useRef(null);
  // loading state
  const [isLoading, setIsLoading] = useState(true);
  // data recieved state
  const [data, setData] = useState();
  // coordinates state for map, for testing they are set here, otherwise they would be asked to user cellphone
  const [coordinates, setCoordinates] = useState({
    latitude: 48.850869,
    longitude: 2.378946,
  });

  useEffect(() => {
    const fetchData = async () => {
      const askPermissionAndGetCoords = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync();
          // for testing purpose we use fixed coordinates
          // setCoordinates({
          //   latitude: coords.latitude,
          //   longitude: coords.longitude,
        } else {
          alert(
            "access denied, you can still change your choice in your app's paramaters"
          );
        }
      };
      askPermissionAndGetCoords();

      try {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        console.log(JSON.stringify(response.data, null, 2));
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#eee",
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../assets/searching.json")}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // ask ios to use GoogleMaps instead of Maps
        provider={PROVIDER_GOOGLE}
        // setting map center
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        // show location only if user accepts
        showsUserLocation
      >
        {data.map((coords) => {
          return (
            <Marker
              key={coords._id}
              coordinate={{
                latitude: coords.location[1],
                longitude: coords.location[0],
              }}
              title={coords.title}
              description={coords.description}
              onPress={() => {
                console.log("from AroundMe ==> ", coords._id);
                navigation.push("Room", { userId: coords._id });
                navigation.navigate("Room", { userId: coords._id });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  animationContainer: {
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  map: {
    // flex: 1,
    width: "100%",
    height: "100%",
  },
});
