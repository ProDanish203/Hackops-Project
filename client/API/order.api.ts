import api from "./middleware";

export const getAllOrders = async ({
  page,
  limit,
  search,
  status,
}: {
  limit: number;
  page: number;
  status: string;
  search: string;
}) => {
  if (
    status &&
    !["pending", "processing", "completed", "cancelled"].includes(status)
  )
    return {
      success: false,
      response: "Invalid status",
    };

  try {
    const { data } = await api.get(
      `/order?limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }&status=${status || ""}`
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

export const getOrderById = async (id: string) => {
  try {
    const { data } = await api.get(`/order/${id}`);

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

export const changeOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    if (
      status &&
      !["pending", "processing", "completed", "cancelled"].includes(status)
    )
      return {
        success: false,
        response: "Invalid status",
      };

    const { data } = await api.patch(`/order/${id}/status`, {
      status,
    });

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
