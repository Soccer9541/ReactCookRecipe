import { useNavigate } from "react-router-dom";
import styles from './Profile.module.css';
import { getAuth, onAuthStateChanged, deleteUser  } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Profile(){
  const auth = getAuth();
  const user = auth.currentUser;
  let navigate = useNavigate();
  let [userName,setUserName]= useState('');
  let [photo,setPhoto]=useState(process.env.PUBLIC_URL + '/images/puppy.jpg');

  let 로그인유저 = JSON.parse(localStorage.getItem('user'));

  let 회원탈퇴 = async function (){

    await 회원정보가져오기()
    .then((id)=>{
      console.log(id);
      deleteDoc(doc(db, "users", id));
      console.log(user.uid + "삭제 완료")
    })

    deleteUser(user).then(() => {
      // User deleted.
      alert('회원 탈퇴 완료!');
      navigate('/');
    }).catch((error) => {
      console.log(error)
    });
  }

  let 회원정보가져오기 = async function(){
    const querySnapshot = await getDocs(collection(db, "users"));
    let id = ''
    querySnapshot.forEach((doc) => {
      if(doc.data().uid === user.uid){
        id = doc.id
      }
    });
    console.log(id);
    return id;
  }

  useEffect(()=>{
    // 회원정보가져오기();
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
    <div style={{minHeight : '500px', paddingTop : '50px'}}>
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" id={styles.profileArea}>
          <div className={styles.myInfo}>
            <div className="avatar p-3 flex justify-center">
              <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto">
                <img src={photo} alt="프로필사진"/>
              </div>
            </div>
            <div>
              {userName} 님
            </div>
          </div>
          <hr />
          {
            로그인유저.email.split('@')[1] !== 'gmail.com' ?

            <>
              <div className={styles.settings}>
                <p>계정</p>
                <ul className="menu menu-compact bg-base-100 w-56 p-2 rounded-box">
                  <li onClick={()=>{navigate('/newPassword')}}><a>비밀번호 변경</a></li>
                  <li onClick={()=>{navigate('/changePhoto')}}><a>프로필 사진 변경</a></li>
                  <li><label htmlFor="my-modal-6"><a>회원 탈퇴</a></label></li>
                  
                </ul>
              </div>
              <hr />
            </>
            :
            null
          }
          
          <div className={styles.history}>
            <p>이용내역</p>
            <ul className="menu menu-compact bg-base-100 w-56 p-2 rounded-box">
              <li onClick={()=>{navigate('/myPost')}}><a>내가 쓴 글</a></li>
              <li onClick={()=>{navigate('/myLike')}}><a>내가 좋아요 누른 글</a></li>
            </ul>
          </div>
        </div>

        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">회원 탈퇴하기</h3>
            <p className="py-4" style={{textAlign : 'center'}}>회원 탈퇴를 진행하시면 계정을 다시 복구하실 수 없습니다.<br />그래도 진행하시겠습니까?</p>
            <div className="modal-action flex justify-center">
              <label htmlFor="my-modal-6" className="btn btn-outline" onClick={()=>{회원탈퇴()}}>예</label>
              <label htmlFor="my-modal-6" className="btn btn-outline" onClick={()=>{navigate('/profile')}}>아니오</label>
            </div>
          </div>
        </div>

    </div>
  )
}

export default Profile;