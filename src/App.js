import './App.css';
import { Routes, Route  } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import Navbar from './components/Navbar';
import Recipe from './routes/Recipe';
import Upload from './routes/Upload';
import MyPost from './routes/MyPost';
import Menus from './components/Menus';
import ChangePhoto from './routes/ChangePhoto';
import NewPassword from './routes/NewPassword';
import Detail from './routes/Detail';
import Modify from './routes/Modify';

function App() {
  return (
    <div className="App" data-theme="lemonade">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={ <Home></Home> } />
        <Route path="/login" element={ <Login></Login> } />
        <Route path="/signup" element={ <Signup></Signup> } />
        <Route path='/profile' element={<Profile></Profile>}></Route>
        <Route path='/write' element={<Upload></Upload>}></Route>
        <Route path='/modify/:postDocID' element={<Modify></Modify>}></Route>
        <Route path='/myPost' element={<MyPost></MyPost>}></Route>
        <Route path='/recipe' element={<Menus></Menus>}></Route>
        <Route path='/recipe/:category' element={<Recipe></Recipe>}></Route>
        <Route path='/changePhoto' element={<ChangePhoto></ChangePhoto>}></Route>
        <Route path='/newPassword' element={<NewPassword></NewPassword>}></Route>
        <Route path='/detail' element={<Detail></Detail>}></Route>
      </Routes>
    </div>
  );
}

export default App;
