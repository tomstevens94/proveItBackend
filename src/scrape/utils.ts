import axios from "axios";

export const fetchHtml = async (url: string) => {
  const response = await axios.get(url);

  return response.data;
};
