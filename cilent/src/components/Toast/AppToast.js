import Toast from "react-native-toast-message";

export const showToast = ({
  type = "success",
  message = "",
  onHide = () => {},
}) => {
  Toast.show({
    type,
    text1: message,
    onHide,
  });
};
