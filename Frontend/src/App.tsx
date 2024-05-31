import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Userformpage from "./pages/Userformpage";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextState } from "./context/UserContext";
import axios from "axios";
import Replspage from "./pages/Replspage";
import Deploypage from "./pages/Deploypage";
import Teampage from "./pages/Teampage";

function App() {
	const { user, setUser } = useContext<UserContextState>(UserContext);
	const [isFetching, setIsFetching] = useState(false); 

	const fetchUser = async (accessToken: string | null) => {
		if (accessToken && !isFetching) {
			setIsFetching(true); 
			try {
				const response = await axios.get("http://localhost:8080/user/data", {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				setUser(response.data.user);
				console.log(response.data.user);
			} catch (error) {
				console.error("Error fetching user info:", error);
			} finally {
				setIsFetching(false);
			}
		}
	};

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
				<Route path="/repls" element={<Replspage />} />
				<Route path="/deployments" element={<Deploypage />} />
				<Route path="/teams" element={<Teampage />} />
				<Route path="/User/user" element={<Userformpage />} />
			</Routes>
		</Router>
	);
}

export default App;
