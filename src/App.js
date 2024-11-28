import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Board from './pages/Board';
import Input from './pages/Input';
import Read from './pages/Read';
import Password from './pages/Password';
import './style/font.scss';

function App() {
  return (
    <div className="container">
      {/* <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}> */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/board" element={<Board />} />
          <Route path="/newpost" element={<Input />} />
          <Route path="/edit/:id" element={<Input />} />
          <Route path="/board/:id" element={<Read />} />
          <Route path="/valid_pw/:id" element={<Password />} />
        </Routes>
      </Router>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
