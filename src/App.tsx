import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./core/auth/AuthContext";
import {LoginPage} from "./features/Login";
import {HomePage} from "./features/Home";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme/theme";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider theme={theme}>
					<Routes>
						<Route path="/login" element={<LoginPage />} />

						<Route path="/" element={<HomePage />} />

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
