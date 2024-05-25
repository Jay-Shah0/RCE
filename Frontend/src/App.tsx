import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Userformpage from "./pages/Userformpage";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextState } from "./context/UserContext";
import axios from "axios";

function App() {
	const { user, setUser } = useContext<UserContextState>(UserContext);
	const [isFetching, setIsFetching] = useState(false); // State to prevent multiple API calls

	const fetchUser = async (accessToken: string | null) => {
		if (accessToken && !isFetching) {
			setIsFetching(true); // Set fetching state to true
			try {
				const response = await axios.get("http://localhost:3000/user/data", {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				setUser(response.data.user); // Update user state directly in context
				console.log(response.data.user);
			} catch (error) {
				console.error("Error fetching user info:", error);
				// Handle error (e.g., handle expired access token or display an error message)
			} finally {
				setIsFetching(false); // Reset fetching state
			}
		}
	};

	// Access user data from context if available
	useEffect(() => {
		const accessToken = localStorage.getItem("access_token");
		if (accessToken && !user) {
			fetchUser(accessToken);
		}
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/User" element={<Userpage />} />
				<Route path="/repls" element={<Homepage />} />
				<Route path="/deployments" element={<Homepage />} />
				<Route path="/teams" element={<Homepage />} />
				<Route path="/User/user" element={<Userformpage />} />
			</Routes>
		</Router>
	);
}

export default App;
