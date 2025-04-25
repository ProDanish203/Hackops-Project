import api from "./middleware";

export const getAllProducts = async ({
  page,
  limit,
  search,
  filter,
}: {
  limit: number;
  page: number;
  filter: string;
  search: string;
}) => {
  try {
    const { data } = await api.get(
      `/product?limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }&filter=${filter || ""}`,
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

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await api.delete(`/product/${id}`, {
      withCredentials: true,
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

export const addProduct = async (formData: FormData) => {
  try {
    const { data } = await api.post(`/product/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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

export const updateProduct = async ({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) => {
  try {
    const { data } = await api.put(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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

export const getSingleProduct = async (id: string) => {
  try {
    const { data } = await api.get(`/product/${id}`, {
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
