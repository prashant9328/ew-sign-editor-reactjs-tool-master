import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ToastTypeEnum} from "../constants/toastTypeEnum"; 

export const ShowToast = (type, message) => {
    switch (type) {
        case ToastTypeEnum.INFO:
          toast.info(message, {
            toastId: ToastTypeEnum.INFO,
          });
          break;
        case ToastTypeEnum.SUCCESS:
          toast.success(message, {
            toastId: ToastTypeEnum.SUCCESS,
          });
          break;
        case ToastTypeEnum.WARNING:
          toast.warn(message, {
            toastId: ToastTypeEnum.WARNING,
          });
          break;
        case ToastTypeEnum.ERROR:
          toast.error(message, {
            toastId: ToastTypeEnum.ERROR,
          });
          break;
        default:
          toast(message);
          break;
      }
}