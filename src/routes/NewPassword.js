import styles from './NewPassword.module.css';
import { useState } from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged, EmailAuthProvider } from 'firebase/auth';
import 패스워드형식체크 from '../functions/pwCheck';
import ReAuthentication from '../components/ReAuthentication';

function NewPassword(){
  let [password,setPassword]= useState('');
  let [passwordConfirm,setPasswordConfirm]= useState('');
  let [재인증이메일,재인증이메일설정]= useState('');
  let [재인증패스워드,재인증패스워드설정]= useState('');
  let navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  let 비밀번호변경 =async function(e){
    e.preventDefault();
    if(password===''){
      alert('비밀번호는 입력해야함 ㅅㄱ');
      return
    }

    if(!패스워드형식체크(password)){
      alert('8~10자 사이 영문과 숫자조합으로 입력');
      return
    }

    if(password!==passwordConfirm){
      alert('비밀번호가 일치하지 않습니다 ㅅㄱ');
      return
    }
    try{
      await updatePassword(user, password).then(() => {
        // Update successful.
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/profile');
      })
    }
    catch(error){
      alert(error.message);
    }
  }


  let 재인증하기 = async function(event){
    event.preventDefault();

    // 이메일/패스워드 자격 증명 객체를 만듭니다.
    const credential = EmailAuthProvider.credential(재인증이메일, 재인증패스워드);

    try {
      await reauthenticateWithCredential(user,credential)
      .then(()=>{
        alert('재인증 성공');
        document.querySelector('.modal').classList.remove('modal-open');
      })
      
    }
    catch(error){
      alert('이메일 또는 비밀번호를 다시 한 번 확인해주세요.');
    }
  }

  useEffect(()=>{
    
    onAuthStateChanged(auth,(user)=>{
      if(user){
        
      } else{
        
      }
    })
  })



  return(
    <div>
      <div className={styles.pwArea}>
        비밀번호 재설정 페이지
        <form action="">
          <div>
            <div>
              <span>비밀번호(8~10자리사이 영어와 숫자조합)</span>
              <input type="password" name="패스워드" id='pwChange' placeholder="패스워드를 입력하세요." onChange={(e)=>{setPassword(e.target.value);}}/>
            </div>

            <div>
              <span>비밀번호확인</span>
              <input type="password" name="패스워드" id='pwChangeAgain' placeholder="패스워드를 다시 한 번 입력하세요." onChange={(e)=>{setPasswordConfirm(e.target.value);}}/>
            </div>
          </div>
          <button type="submit" className='btn btn-outline' onClick={(e)=>{비밀번호변경(e)}}>비밀번호변경</button>
        </form>

        {/* 여기에 사용자 재인증 모달창 띄우면 됨 */}
        {/* <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">사용자 재인증</h3>
            <div>
              <span>이메일</span>
              <input type="email" value={재인증이메일} placeholder='이메일을 다시 입력해주세요.' onChange={(e) => 재인증이메일설정(e.target.value)}/>
            </div>
            <div>
              <span>비밀번호</span>
              <input type="password" value={재인증패스워드} placeholder='비밀번호를 다시 입력해주세요.' onChange={(e) => 재인증패스워드설정(e.target.value)}/>
            </div>
            <button htmlFor="my-modal" className="btn btn-outline" onClick={(e)=>{재인증하기(e)}}>사용자 재인증</button>
          </div>
        </div> */}
        <ReAuthentication 재인증이메일={재인증이메일} 재인증이메일설정={재인증이메일설정} 재인증패스워드 ={재인증패스워드} 재인증패스워드설정 = {재인증패스워드설정} 재인증하기 = {재인증하기}></ReAuthentication>
      </div>
    </div>
  )
};

export default NewPassword;