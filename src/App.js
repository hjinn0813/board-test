import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Board from './pages/Board';
import Input from './pages/Input';
import Read from './pages/Read';
import './style/font.scss';

function App() {
  return (
    <div className="container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/board" element={<Board />} />
          <Route path="/newpost" element={<Input />} />
          <Route path="/edit/:id" element={<Input />} />
          <Route path="/board/:id" element={<Read />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
