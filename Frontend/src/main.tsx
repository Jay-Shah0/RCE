import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import UserProvider from "./context/UserProvider.tsx";
import PopupProvider from "./context/PopupProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UserProvider>
			<PopupProvider>
				<App />
			</PopupProvider>
		</UserProvider>
	</React.StrictMode>
);
