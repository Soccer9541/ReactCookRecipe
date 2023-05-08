import styles from './ChangePhoto.module.css';
import { useState } from 'react';
import { getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getStorage,ref,uploadBytes,getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import ReAuthentication from '../components/ReAuthentication';


function ChangePhoto(){
  const auth = getAuth();
  const user = auth.currentUser;
  const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');
  let navigate = useNavigate();
  let [재인증이메일,재인증이메일설정]= useState('');
  let [재인증패스워드,재인증패스워드설정]= useState('');

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

  }

  let 프로필사진변경 = async function(){
    let fileImage = document.querySelector('#uploadFile').files[0];
    await 프로필업데이트(fileImage)
    .then(()=>{
      alert('프로필 사진 변경 완료!');
      setImageSrc(process.env.PUBLIC_URL + '/images/profileDefualt.jpg');
      navigate('/profile');
    })
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


  return(
    <div>
      <div className={styles.changePhotoArea}>
        프로필 사진 바꾸기
        <form action="">
          <div>
            <span>프로필</span>
            <input type="file" id="uploadFile" onChange={(e)=>{e.preventDefault();사진미리보기(e)}} />
            <div className={styles.profileImg}>
              {imageSrc && <img src={imageSrc} alt="Preview" />}
            </div>
          </div>
          <button className='btn btn-outline' onClick={(e)=>{e.preventDefault();프로필사진변경()}}>프로필 사진 바꾸기</button>
        </form>
      </div>

      {/* 여기에 사용자 재인증 모달창 띄우면 됨 */}
      <ReAuthentication 재인증이메일={재인증이메일} 재인증이메일설정={재인증이메일설정} 재인증패스워드 ={재인증패스워드} 재인증패스워드설정 = {재인증패스워드설정} 재인증하기 = {재인증하기}></ReAuthentication>
    </div>
  )
};

export default ChangePhoto;