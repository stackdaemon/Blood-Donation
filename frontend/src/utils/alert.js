import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Beautiful SweetAlert confirmation modal to replace window.confirm
 */
export const confirmDialog = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmButtonText = 'Yes, proceed',
  cancelButtonText = 'Cancel',
  icon = 'warning',
  danger = true
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: danger ? '#dc2626' : '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 font-sans',
      title: 'text-xl font-bold text-gray-900 dark:text-white',
      htmlContainer: 'text-sm text-gray-600 dark:text-gray-300 mt-2',
      confirmButton: 'px-5 py-2.5 rounded-xl font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer',
      cancelButton: 'px-5 py-2.5 rounded-xl font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer mr-3'
    },
    buttonsStyling: true,
  });

  return result.isConfirmed;
};

/**
 * Beautiful toast notifications
 */
export const showSuccessToast = (msg) => {
  return toast.success(msg, {
    duration: 3500,
    style: {
      borderRadius: '14px',
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #1e293b',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      fontWeight: 500,
      padding: '12px 16px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#0f172a',
    },
  });
};

export const showErrorToast = (msg) => {
  return toast.error(msg, {
    duration: 4000,
    style: {
      borderRadius: '14px',
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #1e293b',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      fontWeight: 500,
      padding: '12px 16px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#0f172a',
    },
  });
};

export const showInfoToast = (msg) => {
  return toast(msg, {
    duration: 3500,
    icon: 'ℹ️',
    style: {
      borderRadius: '14px',
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #1e293b',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      fontWeight: 500,
      padding: '12px 16px',
    },
  });
};

export { toast, Toaster, Swal };
