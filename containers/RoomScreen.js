import { useRoute, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState, useRef, Component } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  AppRegistry,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Swiper from "react-native-swiper";
import { AntDesign } from "@expo/vector-icons";

export default function RoomScreen() {
  const navigation = useNavigation();
  const animation = useRef(null);
  const { params } = useRoute();

  // loading state
  const [isLoading, setIsLoading] = useState(true);
  // data recieved state
  const [data, setData] = useState();
  // display description state
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        try {
          const response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${params.userId}`
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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          activeDotColor="white"
        >
          {data.photos.map((pic) => {
            return (
              <View style={styles.slide1} key={pic.picture_id}>
                <Image
                  source={{ uri: pic.url }}
                  style={{ width: "100%", height: 300, objectFit: "cover" }}
                />
              </View>
            );
          })}
        </Swiper>
        <Text style={styles.price}>{`${data.price} €`}</Text>
      </View>
      <View style={styles.infoBlock}>
        <View style={styles.textBlock}>
          <Text numberOfLines={1} style={styles.title} ellipsizeMode="tail">
            {data.title}
          </Text>
          <View style={styles.rating}>
            <FontAwesome name="star" size={18} color="#FFB100" />
            {data.ratingValue > 1 ? (
              <FontAwesome name="star" size={18} color="#FFB100" />
            ) : (
              <FontAwesome name="star" size={18} color="#BBBBBB" />
            )}
            {data.ratingValue > 2 ? (
              <FontAwesome name="star" size={18} color="#FFB100" />
            ) : (
              <FontAwesome name="star" size={18} color="#BBBBBB" />
            )}
            {data.ratingValue > 3 ? (
              <FontAwesome name="star" size={18} color="#FFB100" />
            ) : (
              <FontAwesome name="star" size={18} color="#BBBBBB" />
            )}
            {data.ratingValue > 4 ? (
              <FontAwesome name="star" size={18} color="#FFB100" />
            ) : (
              <FontAwesome name="star" size={18} color="#BBBBBB" />
            )}
            <Text>{`${data.reviews} reviews`}</Text>
          </View>
        </View>
        <Image
          source={{ uri: data.user.account.photo.url }}
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: 40,
          }}
        />
      </View>

      {showDescription ? (
        <>
          <Text style={styles.description}>{data.description}</Text>
          <TouchableOpacity
            style={styles.display}
            onPress={() => setShowDescription(false)}
          >
            <Text style={{ color: "#717171" }}>Show less</Text>
            <AntDesign name="caretup" size={14} color="#717171" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={styles.description}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {data.description}
          </Text>
          <TouchableOpacity
            style={styles.display}
            onPress={() => setShowDescription(true)}
          >
            <Text style={{ color: "#717171" }}>Show more</Text>
            <AntDesign name="caretdown" size={14} color="#717171" />
          </TouchableOpacity>
        </>
      )}

      <Image
        source={require("../assets/map.png")}
        style={{ width: "100%", height: 300, objectFit: "cover" }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  //swiper style
  wrapper: {
    height: 300,
  },
  slide1: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // end swiper style

  animationContainer: {
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  container: {
    backgroundColor: "white",
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
    paddingHorizontal: 20,
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
  description: {
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 20,
  },
  display: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 30,
  },
});
