import { AxiosError } from "axios";
import { ArgsProps } from "antd/es/notification";
import { NotificationInstance } from "antd/es/notification/interface";
import { AuthError } from "../models/Auth";

export const handleAxiosError = (
  error: AxiosError<AuthError>,
  notification?: NotificationInstance,
  customConfig?: Partial<ArgsProps>
) => {
  const defaultConfig: ArgsProps = {
    message: "Request Failed",
    description: "An unexpected error occurred.",
    placement: "topRight",
    duration: 10,
    ...customConfig,
  };

  const errorDetail = error.response?.data?.detail;

  if (errorDetail) {
    let errorDescription = "An error occurred.";

    if (Array.isArray(errorDetail)) {
      errorDescription = errorDetail[0]?.msg || errorDescription;
    } else if (typeof errorDetail === "string") {
      errorDescription = errorDetail;
    }

    defaultConfig.description = errorDescription;
  }

  if (notification) {
    notification.error(defaultConfig);
  }
};
