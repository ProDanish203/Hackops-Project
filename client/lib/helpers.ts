export const convertImage = async (file: File): Promise<string> => {
  const reader = new FileReader();
  await new Promise<void>((resolve, reject) => {
    reader.onload = () => {
      resolve();
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });

  return reader.result as string;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateToTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
