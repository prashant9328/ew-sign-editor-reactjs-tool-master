import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastTypeEnum } from "../constants/toastTypeEnum";

export const ShowToast = (type, message) => {
  switch (type) {
    case ToastTypeEnum.INFO:
      toast.info(message, {
        toastId: ToastTypeEnum.INFO,
        autoClose: true,
      });
      break;
    case ToastTypeEnum.SUCCESS:
      toast.success(message, {
        toastId: ToastTypeEnum.SUCCESS,
        autoClose: true,
      });
      break;
    case ToastTypeEnum.WARNING:
      toast.warn(message, {
        toastId: ToastTypeEnum.WARNING,
        autoClose: true,
      });
      break;
    case ToastTypeEnum.ERROR:
      toast.error(message, {
        toastId: ToastTypeEnum.ERROR,
        autoClose: true,
      });
      break;
    default:
      toast(message, { autoClose: true });
      break;
  }
};
