import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import PopupProvider from "./context/PopupProvider.tsx";
import ReplsProvider from "./context/ReplsProvider.tsx";
import UserProvider from "./context/UserProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
		<UserProvider>
			<ReplsProvider>
				<PopupProvider>
					<App />
				</PopupProvider>
			</ReplsProvider>
		</UserProvider>
);
