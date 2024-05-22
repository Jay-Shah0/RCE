import React from "react";

const Userpage: React.FC = () => {

	const handleSignInWithGoogle = () => {
		window.location.href = "http://localhost:3000/auth/google/login";
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<header>
				<button
					style={{
						padding: "10px",
						backgroundColor: "#007bff",
						color: "#fff",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
					onClick={handleSignInWithGoogle}
				>
					Sign in with Google
				</button>
			</header>
		</div>
	);
};

export default Userpage;
