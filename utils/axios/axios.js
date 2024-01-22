import axios from "axios";
// export const baseURL =
//   "https://8f04-2800-bf0-19-1118-c587-3223-2e1a-7201.ngrok-free.app";
export const baseURL = 'http://localhost:5000';

export const requestAPI = (endpoint, data, method = "get") => {
  const url = `${baseURL}/${endpoint}`;
  try {
    if (method === "get") return axios.get(url);
    else if (method === "post") return axios.post(url, data);
    else if (method === "put") return axios.put(url, data);
    else if (method === "delete") return axios.delete(url);
  } catch (err) {
    console.error(err.response);
  }
};
export const requestValdationToken = (endpoint, data, method = 'get') => {
  const url = `${baseURL}/${endpoint}`;
  const token = localStorage.getItem('token') || '';
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401 && token) {
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  );
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: 'Bearer ' + token,
    },
  };
  if (method === 'get') return axios.get(url, axiosConfig);
  else if (method === 'post') return axios.post(url, data, axiosConfig);
  else if (method === 'put') return axios.put(url, data, axiosConfig);
  else if (method === 'delete') return axios.delete(url, axiosConfig);
};
export const verifySession = (endpoint) => {
  const url = `${baseURL}/${endpoint}`;
  const token = localStorage.getItem('token') || '';
  axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        return new Error('Exception auth');
      }
    }
  );
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: token,
    },
  };
  return axios.get(url, axiosConfig);
};





