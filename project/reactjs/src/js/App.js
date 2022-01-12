import Routes from './routes/Routes' 
import { BrowserRouter as Router } from 'react-router-dom' 
import Navigation from './components/Layout/Navigation.js'  

function App() {
    return (
        <Router>
            <header>    
                <Navigation/>
            </header>
            <main>
                <Routes/>
            </main>
        </Router>
    )   
}

export default App 