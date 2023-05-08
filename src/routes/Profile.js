import { useNavigate } from "react-router-dom";
import styles from './Profile.module.css';
import { getAuth, onAuthStateChanged, deleteUser  } from "firebase/auth";
import { useEffect, useState } from "react";

function Profile(){
  const auth = getAuth();
  const user = auth.currentUser;
  let navigate = useNavigate();
  let [userName,setUserName]= useState('');
  let [photo,setPhoto]=useState(process.env.PUBLIC_URL + '/images/puppy.jpg');

  function 회원탈퇴(){
    deleteUser(user).then(() => {
      // User deleted.
      alert('회원 탈퇴 완료!');
      navigate('/');
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(()=>{
    
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setUserName(user.email);
        setPhoto(user.photoURL);
      } else{
        setUserName('');
        setPhoto(process.env.PUBLIC_URL + '/images/puppy.jpg');
      }
    })
  },[])

  return(
    <div>

      프로필 페이지용
      <div className={styles.profileArea}>
        <div className={styles.myInfo}>
          <div className="avatar p-3 flex justify-center">
            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto">
              <img src={photo} alt="프로필사진"/>
            </div>
          </div>
          <div>
            {userName}
          </div>
        </div>
        <div className={styles.settings}>
          <p>계정</p>
          <ul className="menu menu-compact bg-base-100 w-56 p-2 rounded-box">
            <li onClick={()=>{navigate('/newPassword')}}><a>비밀번호 변경</a></li>
            <li onClick={()=>{navigate('/changePhoto')}}><a>프로필 사진 변경</a></li>
            <li onClick={()=>{회원탈퇴()}}><a>회원 탈퇴</a></li>
          </ul>
        </div>
        <div className={styles.history}>
          <p>이용내역</p>
          <ul className="menu menu-compact bg-base-100 w-56 p-2 rounded-box">
            <li onClick={()=>{navigate('/myPost')}}><a>내가 쓴 글</a></li>
            <li><a>내 스크랩</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile;