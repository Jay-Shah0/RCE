import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextState } from "../context/UserContext";
import { MenubarDemo } from "@/components/navbar";

const Homepage: React.FC = () => {
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
		<>
		<div>
			<MenubarDemo/>
			hi user:{user?.username}
		</div>
		</>
	)
};

export default Homepage;
