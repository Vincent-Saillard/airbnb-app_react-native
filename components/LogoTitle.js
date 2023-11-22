import logo from "../assets/logo.png";
import { Image } from "react-native";

const LogoTitle = () => {
  return (
    <Image
      style={{
        width: 30,
        height: 30,
        objectFit: "contain",
      }}
      source={logo}
    />
  );
};

export default LogoTitle;
