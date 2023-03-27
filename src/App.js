import './App.css';
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Home} />
      </Routes>
      {/* <Home/> */}
    </Router>
  );
}

export default App;
