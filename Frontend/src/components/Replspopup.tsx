import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SearchResultTemplates, Templates } from './replspopup/Templates';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastConfig from '@/utils/toastConfig';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { PopupContext } from '@/context/PopupContext';
import { UserContext } from '@/context/UserContext';
import { ReplsContext, ReplsContextState } from '@/context/ReplsContext';
import { useNavigate } from 'react-router-dom';

interface popupProps {
  onClose: () => void;
}

interface Template {
	id: number;
	name: string;
	details: string;
}

const Replspopup: React.FC<popupProps> = ({ onClose }) => {
	const navigate = useNavigate();
	const replNameRef = useRef<HTMLInputElement>(null);

	const { user } = useContext(UserContext);
	const { setGitPopup } = useContext(PopupContext);
	const { repls, setRepls } = useContext<ReplsContextState>(ReplsContext);


	const [searchTerm, setSearchTerm] = useState<string>("");
	const [templates, setTemplates] = useState<Template[]>([]);
	const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
	const [showTemplates, setShowTemplates] = useState<boolean>(false);
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
	const [selectedPublic, setSelectedPublic] = useState<boolean | null>(null); // Initial state

	const fetchTemplates = async () => {
		try {
			const response = await fetch("/templates.json");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setTemplates(data);
			setFilteredTemplates(data);
		} catch (error) {
			console.error("Error fetching templates:", error);
		}
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const term = event.target.value.toLowerCase();
		setSearchTerm(term);
		setFilteredTemplates(
			templates.filter((template) => template.name.toLowerCase().includes(term))
		);
		setShowTemplates(term !== "");
	};

	const handleSelectTemplate = (template: Template) => {
		setSelectedTemplate(template);
		setSearchTerm(template.name);
		setShowTemplates(false);
	};

	const handleClearSelection = () => {
		setSelectedTemplate(null);
		setSearchTerm("");
		setShowTemplates(false);
	};

	const configcheck = () => {

		if (replNameRef.current === null) {
			return;
		}

		if (selectedTemplate === null) {
			toast.error(
				"No template is selected. Please select a template.",
				toastConfig
			);
			return;
		}

		if (replNameRef.current.value === "") {
			toast.error(
				"No name provided for the repl. Please give it a name.",
				toastConfig
			);
			return;
		}

		if (selectedPublic === null) {
			toast.error(
				"Please select public or private repl",
				toastConfig
			);
			return;
		}
		createRepl(
			replNameRef.current.value,
			selectedTemplate.name,
			selectedPublic
		);
	};

	const createRepl = async (
		replTemplate: string,
		replName: string,
		isPublic: boolean
	) => {
		try {
			const accessToken = localStorage.getItem("access_token");

			if (!accessToken) {
				throw new Error("Access token not found in local storage");
			}

			const body: {
				repl: { replName: string; replTemplate: string; isPublic: boolean };
			} = {
				repl: {
					replName: replTemplate,
					replTemplate: replName,
					isPublic: isPublic,
				},
			};

			console.log(body);

			const headers = { Authorization: `Bearer ${accessToken}` };

			const response = await axios.post(
				"http://localhost:3000/api/repl/create",
				body,
				{ headers }
			);

			console.log("Repl created successfully:", response.data);
			response.data.repldata.updatedAt = "just now"
			
			if(!repls){
				setRepls([response.data.repldata]);
			}else{
				setRepls([...repls, response.data.repldata]);
			}

			const replId = response.data.repldata.id;
			navigate(`/Coding?replId=${replId}`);
		} catch (error) {
			console.error("Error creating repl:", error);
		}
	};

	useEffect(() => {
		fetchTemplates();
	}, []);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-custom-dark p-6 rounded-lg shadow-lg w-3/4 my-16 h-max md:w-1/2 lg:w-1/2 relative">
				<div className="flex justify-between items-center mb-4">
					<div className="text-3xl font-semibold">Create A Repl</div>
					<div className="flex items-center gap-3">
						<button
							className="w-full px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
							onClick={() => setGitPopup(true)}
						>
							<FontAwesomeIcon icon={faGithub} className="mr-2" />
							Import from GitHub
						</button>
						<button
							className=" size-6 ml-3 mb-5 justify-center rounded hover:bg-gray-700"
							onClick={onClose}
						>
							<FontAwesomeIcon icon={faTimes} className="text-2xl" />
						</button>
					</div>
				</div>
				<div className="grid grid-cols-1 h-5/6 md:grid-cols-2 gap-6">
					<div>
						<div className="text-1xl font-medium mb-2">Template</div>
						<div className="relative">
							<input
								type="text"
								className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
								placeholder="Search Templates"
								value={searchTerm}
								onChange={handleSearch}
							/>
							<div
								className="absolute mb-4 right-0 top-0 bottom-0 flex items-center px-3 cursor-pointer"
								onClick={() => setShowTemplates(!showTemplates)}
							>
								{selectedTemplate ? (
									<FontAwesomeIcon
										icon={faTimes}
										onClick={handleClearSelection}
										className="cursor-pointer"
									/>
								) : (
									<FontAwesomeIcon icon={faSearch} />
								)}
							</div>
						</div>
						{selectedTemplate !== null ? (
							<div className="mt-4 p-3 bg-gray-700 rounded">
								<span className="text-2xl">
									Selected Template: {selectedTemplate.name}
								</span>
								<div className="p-3">{selectedTemplate.details}</div>
							</div>
						) : (
							<>
								{showTemplates ? (
									<div className="overflow-y-auto h-72">
										<SearchResultTemplates
											templates={filteredTemplates}
											onSelectTemplate={handleSelectTemplate}
										/>
									</div>
								) : (
									<div className="text-white">
										<div className="mb-2">Recent Templates</div>
										<div className="overflow-y-auto h-64">
											<Templates
												templates={templates}
												onSelectTemplate={handleSelectTemplate}
											/>
										</div>
									</div>
								)}
							</>
						)}
					</div>
					<div className="relative">
						<div className="text-1xl font-medium text-white mb-2">Title</div>
						<input
							type="text"
							ref={replNameRef}
							className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
							placeholder="Enter Repl Name"
						/>
						<div className="flex gap-6 mb-20">
							<label className="inline-flex items-center text-white">
								<input
									type="radio"
									className="form-radio"
									name="privacy"
									value="public"
									onChange={() => setSelectedPublic(true)}
								/>
								<span className="ml-2">Public</span>
							</label>
							<label className="inline-flex items-center text-white">
								<input
									type="radio"
									className="form-radio"
									name="privacy"
									value="private"
									onChange={() => setSelectedPublic(false)}
								/>
								<span className="ml-2">Private</span>
							</label>
						</div>
						<div className="absolute bottom-0 left-0 right-0 flex justify-center">
							<button
								className="w-full px-4 py-2 mb-2 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
								onClick={configcheck}
							>
								<FontAwesomeIcon icon={faPlus} className="mr-2" />
								Create Repl
							</button>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
};

export default Replspopup;
