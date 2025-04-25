import api from "./middleware";

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post(
      "/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/current-user", {
      withCredentials: true,
    });

    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await api.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );

    return {
      success: true,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};
