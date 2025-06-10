import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    hideProgressBar: false
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    hideProgressBar: false
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    hideProgressBar: false
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 3000,
    draggable: true,
    pauseOnHover: true,
    hideProgressBar: false
  });
};
