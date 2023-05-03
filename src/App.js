import './App.css';
import app from './firebase';
import { Routes, Route , Outlet } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import Navbar from './components/Navbar';
import Recipe from './routes/Recipe';
import Upload from './routes/Upload';
import MyPost from './routes/MyPost';

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
        <Route path='/myPost' element={<MyPost></MyPost>}></Route>


        <Route path='/recipe' element={<Recipe></Recipe>}>
          <Route path="rice" element={ <div>밥/죽</div> }></Route>
          <Route path="drinkSnacks" element={ <div>안주요리</div> }></Route>
          <Route path="stew" element={ <div>국/탕/찌개</div> }></Route>
          <Route path="sideDish" element={ <div>반찬</div> }></Route>
          <Route path="western" element={ <div>양식</div> }></Route>
          <Route path="dessert" element={ <div>간식/과자/디저트</div> }></Route>
          <Route path="japanese" element={ <div>일식</div> }></Route>
          <Route path="salad" element={ <div>샐러드</div> }></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
