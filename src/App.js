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
import MyLike from './routes/MyLike';
import Menus from './components/Menus';
import ChangePhoto from './routes/ChangePhoto';
import NewPassword from './routes/NewPassword';
import Detail from './routes/Detail';
import Modify from './routes/Modify';
import Footer from './components/Footer';

function App() {
  let 댓글목록= JSON.parse(localStorage.getItem('comment'));
  if(댓글목록==null){
    localStorage.setItem('comment',JSON.stringify([]));
  }

  let 좋아요목록 = JSON.parse(localStorage.getItem('like'));
  if(좋아요목록==null){
    localStorage.setItem('like',JSON.stringify([]));
  }

  let 유저설정 = JSON.parse(localStorage.getItem('user'));
  if(유저설정==null){
    localStorage.setItem('user',JSON.stringify({uid:'비로그인방문자'}));
  }


  return (
    <div className="App" >
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={ <Home></Home> }></Route>
        <Route path="/login" element={ <Login></Login> }></Route>
        <Route path="/signup" element={ <Signup></Signup> }></Route>
        <Route path='/profile' element={<Profile></Profile>}></Route>
        <Route path='/write' element={<Upload></Upload>}></Route>
        <Route path='/modify/:postDocID' element={<Modify></Modify>}></Route>
        <Route path='/myPost' element={<MyPost></MyPost>}></Route>
        <Route path='/myLike' element={<MyLike></MyLike>}></Route>
        <Route path='/recipe' element={<Menus></Menus>}></Route>
        <Route path='/recipe/:category' element={<Recipe></Recipe>}></Route>
        <Route path='/changePhoto' element={<ChangePhoto></ChangePhoto>}></Route>
        <Route path='/newPassword' element={<NewPassword></NewPassword>}></Route>
        <Route path='/detail' element={<Detail></Detail>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
