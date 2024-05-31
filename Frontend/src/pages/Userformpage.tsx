import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext, UserContextState } from "../context/UserContext";

const Userformpage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, setUser } = useContext<UserContextState>(UserContext);

	const [name, setName] = useState<string>("");
	const [userId, setUserId] = useState<string | null>(null);
	const [namechaged, setNamechaged] = useState(true); // Track username existence error

	// Extract user ID from URL query parameter
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const userId = urlParams.get("id");
		setUserId(userId);
	}, [location]);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!name) {
			return; // Prevent submission if username is empty
		}

		// Only send request if username has changed
		if (user && user.username === name) {
			// Allow update without sending request (username hasn't changed)
			console.log("Username hasn't changed. No need to send request.");
			setNamechaged(false)
			return;
		}

		try {
			const response = await axios.post(`http://localhost:8080/user/update`, {
				id: userId,
				username: name,
			});

			// Handle successful response (update user state or display success message)
			console.log(response);

			if (response.data && response.data.user) {
				setUser(response.data.user);
			}

			localStorage.setItem("access_token", response.data.user.access_token); // Store access token

			setName(""); // Reset input field
			navigate("/"); // Navigate back to home screen
		} catch (error) {
			console.error("Error posting data:", error);
			// Handle errors appropriately (e.g., display an error message)
		}
	};

	useEffect(() => {
		if (user && user.username) {
			setName(user.username);
		}
	}, [user]);

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter username"
					required
					aria-describedby="username-error"
				/>
				{(!namechaged) && (
					<p id="username-error" role="alert">
						Error:Same Username
					</p>
				)}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default Userformpage;
