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
      `/products?limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }&filter=${filter || ""}`
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
    const { data } = await api.delete(`/products/${id}`);

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
    const { data } = await api.post(`/products/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
    const { data } = await api.get(`/products/${id}`);

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
