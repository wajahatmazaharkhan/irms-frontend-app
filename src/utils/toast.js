// src/utils/toast.js
import Swal from "sweetalert2";

const toast = {
  success: (message, options = {}) =>
    Swal.fire({
      icon: "success",
      title: message,
      timer: 2000,

      showConfirmButton: false,
      ...options,
    }),

  error: (message, options = {}) =>
    Swal.fire({
      icon: "error",
      title: message,

      ...options,
    }),

  warning: (message, options = {}) =>
    Swal.fire({
      icon: "warning",
      title: message,

      ...options,
    }),

  info: (message, options = {}) =>
    Swal.fire({
      icon: "info",
      title: message,

      ...options,
    }),
};

export default toast;
