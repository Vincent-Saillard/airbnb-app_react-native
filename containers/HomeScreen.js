import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const animation = useRef(null);
  // loading state
  const [isLoading, setIsLoading] = useState(true);
  // data recieved state
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        try {
          const response = await axios.get(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
          );
          // console.log(JSON.stringify(response.data, null, 2));
          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      } else {
        navigation.navigate("SignIn");
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
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Room", { userId: item._id });
              }}
              style={styles.offerContainer}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.photos[0].url }}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <Text style={styles.price}>{`${item.price} €`}</Text>
              </View>
              <View style={styles.infoBlock}>
                <View style={styles.textBlock}>
                  <Text
                    numberOfLines={1}
                    style={styles.title}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <View style={styles.rating}>
                    <FontAwesome name="star" size={18} color="#FFB100" />
                    {item.ratingValue > 1 ? (
                      <FontAwesome name="star" size={18} color="#FFB100" />
                    ) : (
                      <FontAwesome name="star" size={18} color="#BBBBBB" />
                    )}
                    {item.ratingValue > 2 ? (
                      <FontAwesome name="star" size={18} color="#FFB100" />
                    ) : (
                      <FontAwesome name="star" size={18} color="#BBBBBB" />
                    )}
                    {item.ratingValue > 3 ? (
                      <FontAwesome name="star" size={18} color="#FFB100" />
                    ) : (
                      <FontAwesome name="star" size={18} color="#BBBBBB" />
                    )}
                    {item.ratingValue > 4 ? (
                      <FontAwesome name="star" size={18} color="#FFB100" />
                    ) : (
                      <FontAwesome name="star" size={18} color="#BBBBBB" />
                    )}
                    <Text>{`${item.reviews} reviews`}</Text>
                  </View>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 40,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* <Button
          title="Go to Profile"
          onPress={() => {
            navigation.navigate("Profile", { userId: 123 });
          }}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  offerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
    marginBottom: 20,
  },

  imageContainer: {
    position: "relative",
  },
  price: {
    position: "absolute",
    zIndex: 1,
    color: "white",
    backgroundColor: "black",
    width: 100,
    height: 50,
    left: 0,
    bottom: 10,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 50,
  },

  infoBlock: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  textBlock: {
    width: "72%",
  },
  title: {
    fontSize: 20,
    marginTop: 7,
    marginBottom: 20,
    // borderColor: "red",
    // borderWidth: 1,
  },
  rating: {
    flexDirection: "row",
    gap: 7,
  },
  animationContainer: {
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
