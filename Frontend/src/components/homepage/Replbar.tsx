import { ReplsContext, ReplsContextState } from "@/context/ReplsContext";
import axios from "axios";
import React, { useContext } from "react";

const Replbar: React.FC = () => {
	const { repls, setRepls } = useContext<ReplsContextState>(ReplsContext);

	if (!repls || repls.length === 0) {
	return (
		<div className="text-center">
			No repls created until now
		</div>
	);
	}

	const handleDelete = async (id: string) => {
		try {
			const accessToken = localStorage.getItem("access_token");

			if (!accessToken) {
				throw new Error("Access token not found in local storage");
			}

			const body: {
				repl: { id: string };
			} = {
				repl: {
					id: id,
				},
			};

			console.log(body);

			const headers = { Authorization: `Bearer ${accessToken}` };

			// Send POST request using axios
			const response = await axios.post(
				"http://localhost:3000/api/repl/delete",
				body,
				{ headers }
			);

			console.log("Repl Deleted successfully:", response.data);

			setRepls(repls.filter((repl) => repl.id !== id));
		} catch (error) {
			console.error("Error deleting repl:", error);
		}
	};

	return (
		<div className="space-y-4">
			{repls.map((repl) => (
				<div
					key={repl.id}
					className="flex justify-between items-center w-4/5 border-b pb-2 relative"
				>
					<a
						href={`/repl/${repl.replName}`}
						className="flex justify-between items-center w-full p-3"
					>
						<div className="flex flex-col space-y-1">
							<div>{repl.replName}</div>
							<div className="text-gray-400 space-x-5">
								<span>Template: {repl.replTemplate}</span>
								<span>Updated: {repl.updatedAt}</span>
							</div>
						</div>
					</a>
					<div className="absolute right-5 flex justify-center">
						<button
							onClick={() => handleDelete(repl.id)}
							className="text-gray-500 w-3 hover:text-gray-700"
						>
							&#x22EE;
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Replbar;
