import axiosInstance from "./axios";

export const signupUser = async (userData) => {
  const response = await axiosInstance.post("/api/auth/signup", userData);

  return response;
};
