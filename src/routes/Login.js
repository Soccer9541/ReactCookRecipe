import styles from "./Login.module.css";
import React, { useState,useEffect } from "react";
import { getAuth,signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function Login(){
  let [email,setEmail]= useState('');
  let [password,setPassword]= useState('');
  let navigate = useNavigate();
  let [loginStatus,setLoginStatus] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  

  let 로그인 = async function(){
    if(email==='' || password===''){
      alert('이메일 또는 패스워드를 입력해주세요.');
      return;
    }
    await signInWithEmailAndPassword(auth,email,password)
    .then(()=>{
      alert('로그인 완료');
      setEmail('');
      setPassword('');
      navigate('/')
    })
    .catch(()=>{alert('아이디나 비번이 맞지 않읍니다.')});
    
  }



  let 구글로그인 = function () {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate('/')
      }).catch((error) => {
        console.log(error)
      });
  }

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setLoginStatus(true);
      } else{
        setLoginStatus(false);
      }
    })
  })


  return(
    <div>
      <div className={styles.loginArea}>
        <form>
          <h1 className={styles.title}>집밥의 민족</h1>
          {loginStatus === true ? '로그인됨': '로그아웃상태'}
          <div className={styles.emailInput}>
            <input type="text" name="이메일" id='email' placeholder='이메일' onChange={(e)=>{setEmail(e.target.value);}}/>
          </div>
          <div className={styles.pwInput}>
            <input type="password" name="패스워드" id='pw' placeholder='패스워드' onChange={(e)=>{setPassword(e.target.value);}}/>
          </div>
          
          <div className='flex justify-center items-center'>
            <button id='login' className="btn btn-outline" type="submit" onClick={(e)=>{e.preventDefault();로그인()}}>로그인하기</button>
          </div>

          <hr />
          <div>
            <button style={{marginTop : '10px'}} onClick={(e)=>{e.preventDefault();구글로그인()}}>
              <img src={process.env.PUBLIC_URL + '/images/googleBtn.png'} alt="Example" />
            </button>
            <div style={{marginTop : '20px'}}>
              <span>
                계정이 없으신가요? <Link to={'/signup'}>회원가입</Link>
              </span>
            </div>
          </div>
          <hr />
        </form>
      </div>
      
    </div>
  )
}

export default Login;