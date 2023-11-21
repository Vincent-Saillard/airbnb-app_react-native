import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import logo from "../assets/logo.png";
import { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

export default function SignUpScreen({ setToken, navigation, route }) {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state for error message
  const [errorMessage, setErrorMessage] = useState(false);
  // state waiting request answer
  const [isLoading, setIsLoading] = useState(false);
  // state to show password
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    // console.log(`password=>${password}`, `confirmation=>${confirm}`);
    // check if every fields are filled in
    if (!email || !password) {
      setErrorMessage("Every field must be filled-in");
    } else {
      // else setErrors to empty string and proceed
      setErrorMessage("");

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
            {
              email: email,
              password: password,
            }
          );
          setIsLoading(false);
          alert(`Welcome back to airbnb`);
          // adding token
          const userToken = "secret-token";
          setToken(userToken);

          // waiting next chapter to go to next screen
        } catch (error) {
          setErrorMessage(
            "This combination of email/password does not exist, try again or create an account"
          );
          setIsLoading(false);
        }
      };
      fetchData();
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.darkGrey, styles.title]}>Sign in</Text>
        {/* mail */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        {/* Password */}
        <View style={styles.containerPassword}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            secureTextEntry={showPassword ? false : true}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          {showPassword ? (
            <TouchableOpacity
              style={styles.eyeContainer}
              onPress={() => {
                setShowPassword(false);
              }}
            >
              <Feather name="eye-off" size={20} color="#EB5A62" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.eyeContainer}
              onPress={() => {
                setShowPassword(true);
              }}
            >
              <Feather name="eye" size={20} color="#EB5A62" />
            </TouchableOpacity>
          )}
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#EB5A62"
            style={{ marginVertical: 30 }}
          />
        )}
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {isLoading ? (
          <View style={styles.waitBtn}>
            <Text style={[styles.txtBtn, styles.darkGrey]}>Sign in</Text>
          </View>
        ) : (
          <TouchableHighlight
            style={styles.submitBtn}
            underlayColor="#EB5A62"
            onPress={(event) => {
              console.log("Form submit");
              handleClick(event);
            }}
          >
            <Text style={[styles.txtBtn, styles.darkGrey]}>Sign in</Text>
          </TouchableHighlight>
        )}

        {/* <Button
          title="Sign up"
          onPress={async () => {
            const userToken = "secret-token";
            setToken(userToken);
          }}
        /> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.darkGrey}>No account ? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 50,
    paddingVertical: 20,
    alignItems: "center",
  },

  logo: {
    height: 100,
    objectFit: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 150,
  },
  input: {
    width: "100%",
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 7,
    marginBottom: 27,
  },

  containerPassword: {
    width: "100%",
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 27,
  },
  inputPassword: {
    width: "90%",
    fontSize: 16,
    paddingVertical: 7,
  },
  submitBtn: {
    borderColor: "#EB5A62",
    borderWidth: 3,
    borderRadius: 30,
    height: 60,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 160,
    marginBottom: 20,
  },

  waitBtn: {
    backgroundColor: "lightgrey",
    borderRadius: 30,
    height: 60,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    marginBottom: 20,
  },

  txtBtn: {
    fontSize: 18,
    fontWeight: "bold",
  },

  darkGrey: {
    color: "#717171",
  },
  lightGray: {
    color: "#CDCDCF",
  },
  error: {
    color: "#EB5A62",
  },
});
