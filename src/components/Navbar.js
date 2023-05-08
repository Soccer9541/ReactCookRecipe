import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged,signOut } from "firebase/auth";

function Navbar(){
  let navigate = useNavigate();
  const auth = getAuth();
  let [userName,setUserName]=useState('');
  let [loginStatus,setLoginStatus] = useState(false);
  let [photo,setPhoto]=useState(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');

  let 로그아웃 = function(){
    signOut(auth).then((result) => {
      // Sign-out successful.
      console.log(result);
      console.log('로그아웃 완료!')
      navigate('/');
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  
  

  useEffect(()=>{
    
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setLoginStatus(true);
        setUserName(user.displayName);
        setPhoto(user.photoURL);
      } else{
        setLoginStatus(false);
        setUserName('');
        setPhoto(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');
      }
    })
  })

  
  

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">집밥의 민족</a>
        <button className="btn btn-ghost" onClick={()=>{navigate('/')}}>Home</button>
        <button className="btn btn-ghost" onClick={()=>{navigate('/login')}}>로그인 페이지 </button>
        <button className="btn btn-ghost" onClick={()=>{navigate('/signup')}}> 회원가입</button>
        
        {
          loginStatus === true? 
          <>
            <button className="btn btn-ghost" onClick={()=>{navigate('/profile')}}> 프로필</button>
            <button className="btn btn-ghost" onClick={()=>{navigate('/write')}}> 글 작성</button> 
          </>
          
          :
          null
        }
        
        <button className="btn btn-ghost" onClick={()=>{navigate('/recipe')}}>메뉴 페이지</button>
        
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered" />
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={photo} alt="" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            
            {
              loginStatus === true ?
              <>
                <li onClick={()=>{navigate('/profile')}}><a>Profile</a></li>
                <li onClick={()=>{로그아웃()}}><a>Logout</a></li>
              </>
              :
              <li onClick={()=>{navigate('/login')}}><a>Login</a></li>
            }
            
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;