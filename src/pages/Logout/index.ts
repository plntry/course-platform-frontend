import { redirect } from "react-router";
import { PATHS } from "../../routes/paths";
import { authApi } from "../../api/auth";

export async function action() {
  await authApi.logout();
  return redirect(PATHS.AUTH.link);
}
