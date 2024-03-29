import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 이메일형식체크 from "../functions/idCheck";
import 패스워드형식체크 from "../functions/pwCheck";


function Signup(){
  let [email,setEmail]= useState('');
  let [password,setPassword]= useState('');
  let [passwordConfirm,setPasswordConfirm]= useState('');
  let [userName,setUserName]= useState('');
  let [emailCheck,setEmailCheck] = useState(false);
  const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');

  let navigate = useNavigate();
  const auth = getAuth();

  // Firebase Storage 초기화
  const storage = getStorage();

  // 사용자 프로필 업데이트 함수
  let 프로필업데이트 =async function(photoFile) {
    const user = auth.currentUser;

    // Firebase Storage에 이미지 업로드
    const storageRef = ref(storage, 'images/' + photoFile.name);
    await uploadBytes(storageRef, photoFile);

    // Firebase Storage에서 이미지 URL 가져오기
    const photoURL = await getDownloadURL(storageRef);

    // 사용자 프로필 업데이트
    await updateProfile(user, {
      photoURL: photoURL
    });

    console.log('Profile updated successfully!');
    console.log('Image URL:', photoURL);
    return photoURL;
  }


  let 사진미리보기 = function(event){
    const file = event.target.files[0];
    
    if(file==null){
      setImageSrc(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');
      return
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }



  // 이메일 중복 검사 함수
  function 이메일중복검사(email) {
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          // 해당 이메일 주소로 등록된 계정이 이미 존재함
          alert("This email address is already in use.");
        } else {
          // 해당 이메일 주소로 등록된 계정이 없음
          alert("This email address is available.");
          setEmailCheck(true);
        }
      })
      .catch((error) => {
        console.log("Error fetching sign-in methods for email:", error);
      });
  }

  let 회원가입 = async function(){
    const result = await createUserWithEmailAndPassword(auth,email,password);
    let fileImage = document.querySelector('#uploadFile').files[0];
    const 날짜 = new Date();

    if(fileImage==null){
      alert('이미지를 업로드해주세요.');
      return
    }
    if(!emailCheck){
      alert('중복 검사를 먼저 진행해 주세요.');
      return
    }
    if(!이메일형식체크(email)){
      alert('이메일 형식을 지켜주세요.');
      return
    }
    if(password!==passwordConfirm){
      alert('비밀번호가 일치하지 않습니다.');
      return
    }
    if(!패스워드형식체크(password)){
      alert('비밀번호 형식을 지켜주세요');
      return
    }
    await 프로필업데이트(fileImage)
    await updateProfile(auth.currentUser,{displayName :  userName})
    try{
      
      await addDoc(collection(db, "users"),{
        name : result.user.displayName,
        email : result.user.email,
        uid : result.user.uid,
        photo : result.user.photoURL,
        가입일 : `${날짜.getFullYear()}년 ${날짜.getMonth()+1}월 ${날짜.getDate()}일`
      })
      .then(()=>{
        navigate('/');
        setEmail('');
        setPassword('');
        setEmailCheck(false);
        setUserName('');
        setImageSrc(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');
        signOut(auth);
        alert(result.user.email + '님 회원가입을 축하드립니다!');
        console.log(result.user);
      })
    }
    catch(e){
      console.log(e)
    }
    
  }



  return (
    <div>
      <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100' id={styles.signupArea}>
        <form action="">
          <h1 className={styles.title}>회원가입</h1>

          <div>
            <p>프로필</p>
            <input type="file" id="uploadFile" onChange={(e)=>{e.preventDefault();사진미리보기(e)}} />
            <div className={styles.profileImg}>
              {imageSrc && <img src={imageSrc} alt="Preview" />}
            </div>
          </div>

          <div>
            <p>이름</p>
            <input type="text" name='이름' id = 'userName' placeholder="이름" onChange={(e)=>{setUserName(e.target.value);}}/>
          </div>
          
          <div>
            <p style={{display : 'block'}}>이메일</p>
            <input className={styles.emailNew} type="text" name="이메일" id='idNew' placeholder="이메일을 입력하세요." onChange={(e)=>{setEmail(e.target.value);}}/>
            
            <div style={{clear :'both'}}>
              <button className="btn btn-primary" id={styles.check} onClick={(e)=>{e.preventDefault();이메일중복검사(email)}}>Email 중복 검사</button>
            </div>
          </div>
          
          <div>
            <p>비밀번호(8~10자리사이 영어와 숫자조합)</p>
            <input type="password" name="패스워드" id='pwNew' placeholder="패스워드를 입력하세요." onChange={(e)=>{setPassword(e.target.value);}}/>
          </div>

          <div>
            <p>비밀번호확인</p>
            <input type="password" name="패스워드" id='pwConfirmNew' placeholder="패스워드를 다시 한 번 입력하세요." onChange={(e)=>{setPasswordConfirm(e.target.value);}}/>
          </div>
          
          <button style={{marginTop : '20px'}} type="submit" className="btn btn-outline" onClick={(e)=>{e.preventDefault();회원가입()}}>회원가입하기</button>
        </form>
      </div>
    </div>
  )
}

export default Signup;