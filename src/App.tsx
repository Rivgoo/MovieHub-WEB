import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
/* import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card'; */

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
     			
    		</ThemeProvider>
		</div>
	);
}

export default App;
