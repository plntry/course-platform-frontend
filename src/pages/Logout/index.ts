import { redirect } from "react-router";
import { PATHS } from "../../routes/paths";

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken"); // TODO: remove when the logic on backend is done
  localStorage.removeItem("expiration");
  return redirect(PATHS.AUTH);
}
