import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import Cookies from "js-cookie";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn:  () => authApi.me().then((r) => r.data.data),
    retry: false,
    enabled: !!Cookies.get("access_token"),
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password).then((r) => r.data.data),
    onSuccess: ({ tokens }) => {
      Cookies.set("access_token", tokens.accessToken, { expires: 1, secure: true });
      Cookies.set("refresh_token", tokens.refreshToken, { expires: 7, secure: true });
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      qc.clear();
      window.location.href = "/";
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: {
      name: string; email: string; phone: string;
      password: string; agencyName?: string;
    }) => authApi.register(payload).then((r) => r.data.data),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name?: string; phone?: string; agencyName?: string }) =>
      authApi.updateProfile(dto).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(dto).then((r) => r.data.data),
  });
}
