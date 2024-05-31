import { ToastOptions } from "react-toastify";

const toastConfig: ToastOptions<unknown> = {
	position: "bottom-right",
	autoClose: 4000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "light",
};

export default toastConfig;
