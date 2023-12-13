import {
  Button,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function SettingsScreen({ setToken }) {
  const showToast = (type, title, text) => {
    Toast.show({
      type: type,
      text1: title,
      text2: text,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  // state for data request
  const [dataRecieved, setDataRecieved] = useState();
  // updating state
  const [updating, setUpdating] = useState(false);

  // email state
  const [email, setEmail] = useState("");
  // username state
  const [username, setUsername] = useState("");
  // description state
  const [description, setDescription] = useState("");
  // picture state
  const [picture, setPicture] = useState("");

  // allow opening gallery
  const getPermissionAndOpenGallery = async () => {
    // ask for access to pics gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // console.log(status);
    if (status === "granted") {
      // open pic gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        // for a square picture
        aspect: [1, 1],
      });

      if (result.canceled) {
        // alert("no picture selected");
        showToast("info", "Ooops", "no picture selected");
        // showToast("error");
      } else {
        setPicture(result.assets[0].uri);
      }
    } else {
      showToast(
        "error",
        "Access denied",
        "To change your choice check your app's parameters"
      );
      // alert("access denied, to change your choice check your app's parameters");
    }
  };

  // allow opening camera
  const getPermissionAndOpenCamera = async () => {
    // ask for access to camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      // open camera
      const result = await ImagePicker.launchCameraAsync();
      if (result.canceled) {
        showToast("info", "Ooops", "No picture taken");
        // alert("No picture taken");
      } else {
        setPicture(result.assets[0].uri);
      }
    } else {
      showToast(
        "error",
        "Access denied",
        "To change your choice check your app's parameters"
      );
      // alert("access denied, to change your choice check your app's parameters");
    }
  };

  // send data for update
  const updateData = async () => {
    setUpdating(true);
    // sending a first request for text-inputs
    try {
      // check if all fields are still filled in, if not alert user
      if (!email || !username || !description) {
        showToast(
          "error",
          "Some fields are empty",
          "Please fill-up every fields"
        );
        // alert("Every fields must be filled-in");
        setUpdating(false);
      } else {
        const token = await AsyncStorage.getItem("userToken");
        const resultUpdate = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
          {
            email: email,
            username: username,
            description: description,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log(resultUpdate._response);
        if (picture) {
          const extension = picture.split(".").at(-1);
          const formData = new FormData();
          formData.append("photo", {
            uri: picture,
            name: `myPict.${extension}`,
            type: `image/${extension}`,
          });
          const { data } = await axios.put(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(data);
        }
        // alert("Your informations have been updated successfully");
        showToast(
          "success",
          `Thank you ${username}`,
          "Your informations have been updated successfully"
        );
        setUpdating(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get infos from storage
        const token = await AsyncStorage.getItem("userToken");
        // console.log(token);
        const userId = await AsyncStorage.getItem("userId");
        // console.log(userId);
        // launch GET request to obtain user informations by Id with Bearer Token
        const response = await axios.get(
          ` https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setDataRecieved(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        if (response.data.photo) {
          setPicture(response.data.photo.url);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator></ActivityIndicator>
  ) : (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/* User picture */}
        <View style={styles.userPicContainer}>
          <View style={styles.pictureContainer}>
            {picture ? (
              <Image source={{ uri: picture }} style={styles.avatar} />
            ) : (
              // <Entypo name="user" size={100} color="red" />
              <Entypo name="user" size={100} color="lightgrey" />
            )}
          </View>
          <View style={styles.pictoContainer}>
            <AntDesign
              name="picture"
              size={30}
              color="grey"
              onPress={() => {
                getPermissionAndOpenGallery();
              }}
            />
            <AntDesign
              name="camerao"
              size={30}
              color="grey"
              onPress={() => {
                getPermissionAndOpenCamera();
              }}
            />
          </View>
        </View>

        {/* form */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
        <TextInput
          style={styles.description}
          placeholder="Describe yourself in few words ..."
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
        {updating ? (
          <View style={styles.innactive}>
            <Text style={styles.textBtn}>Update</Text>
          </View>
        ) : (
          <TouchableHighlight
            style={styles.updateBtn}
            underlayColor="#EB5A62"
            onPress={() => {
              updateData();
            }}
          >
            <Text style={styles.textBtn}>Update</Text>
          </TouchableHighlight>
        )}

        <TouchableHighlight
          style={styles.logOutBtn}
          underlayColor="#EB5A62"
          onPress={() => {
            AsyncStorage.removeItem("userId");
            AsyncStorage.removeItem("userToken");
            setToken(null);
          }}
        >
          <Text style={styles.textBtn}>Log out</Text>
        </TouchableHighlight>
        {/* <Text>Hello Settings</Text>

        <Button
          title="Log Out"
          onPress={() => {
            setToken(null);
          }}
        /> */}
      </View>
      <>
        {/* ... */}
        <Toast style={styles.toast} position="top" topOffset={100} />
      </>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  userPicContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 50,
  },
  pictureContainer: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderColor: "#EB5A62",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 75,
    objectFit: "cover",
  },
  pictoContainer: {
    gap: 40,
  },
  input: {
    width: "100%",
    fontSize: 16,
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    paddingVertical: 7,
    marginBottom: 27,
  },
  description: {
    width: "100%",
    borderColor: "#EB5A62",
    borderWidth: 1,
    fontSize: 16,
    paddingVertical: 7,
    paddingHorizontal: 7,
    marginBottom: 27,
    marginTop: 20,
  },
  updateBtn: {
    borderColor: "#EB5A62",
    borderWidth: 3,
    borderRadius: 30,
    height: 60,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  innactive: {
    backgroundColor: "lightgrey",
    borderColor: "lightgrey",
    borderWidth: 3,
    borderRadius: 30,
    height: 60,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  logOutBtn: {
    borderColor: "#EB5A62",
    borderWidth: 3,
    borderRadius: 30,
    height: 60,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 20,
    backgroundColor: "lightgrey",
  },
  textBtn: {
    color: "darkgrey",
    fontWeight: "bold",
    fontSize: 18,
  },
  toast: {
    marginTop: 200,
  },
});
