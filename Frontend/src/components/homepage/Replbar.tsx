import { ReplsContext, ReplsContextState } from "@/context/ReplsContext";
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

	const handleDelete = (name: string) => {
		setRepls(repls.filter((repl) => repl.name !== name));
	};

	return (
		<div className="space-y-4">
			{repls.map((repl) => (
				<div
					key={repl.id}
					className="flex justify-between items-center w-4/5 border-b pb-2 relative"
				>
					<a
						href={`/repl/${repl.name}`}
						className="flex justify-between items-center w-full p-3"
					>
						<div className="flex flex-col space-y-1">
							<div>{repl.name}</div>
							<div className="text-gray-400 space-x-5">
								<span>Template: {repl.template}</span>
								<span>Updated: {repl.updatedAt}</span>
							</div>
						</div>
					</a>
					<div className="absolute right-5 flex justify-center">
						<button
							onClick={() => handleDelete(repl.name)}
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
