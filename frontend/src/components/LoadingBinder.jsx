import { useEffect } from "react";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";

export default function AxiosLoadingBinder() {
  const { increment, decrement } = useLoading();

  useEffect(() => {
    const reqId = axios.interceptors.request.use((config) => {
      increment();
      return config;
    }, (error) => {
      decrement();
      return Promise.reject(error);
    });

    const resId = axios.interceptors.response.use((response) => {
      decrement();
      return response;
    }, (error) => {
      decrement();
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, [increment, decrement]);

  return null;
}
