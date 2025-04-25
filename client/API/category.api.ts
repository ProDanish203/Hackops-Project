import api from "./middleware";

export const createCategory = async (formData: FormData) => {
  try {
    const { data } = await api.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

export const updateCategory = async ({
  formData,
  id,
}: {
  formData: FormData;
  id: string;
}) => {
  try {
    const { data } = await api.put(`/category/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await api.delete(`/category/${id}`, {
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

export const getAllCategories = async ({
  page,
  limit,
  search,
  filter,
  parentId,
}: {
  limit: number;
  page: number;
  filter: string;
  search: string;
  parentId?: string;
}) => {
  try {
    const { data } = await api.get(
      `/category?limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }&filter=${filter || ""}&parentId=${parentId || ""}`,
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

export const getCategoryNames = async () => {
  try {
    const { data } = await api.get(`/category/names`, {
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
