import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Userformpage from "./pages/Userformpage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/User" element={<Userpage/>} />
				<Route path="/User/user" element={<Userformpage />} />
			</Routes>
		</Router>
	);
}

export default App;
