import Toast from "react-native-toast-message";

export const showSuccessToastMessage = (text, onHide = () => {}) => {
  return Toast.show({
    type: "customSuccess",
    text1: text,
    onHide: onHide,
  });
};
export const showWarningToastMessage = (text, onHide = () => {}) => {
  return Toast.show({
    type: "customWarning",
    text1: text,
    onHide: onHide,
  });
};

export const showFailureToastMessage = (text, onHide = () => {}) => {
  return Toast.show({
    type: "customFailure",
    text1: text,
    onHide: onHide,
  });
};
