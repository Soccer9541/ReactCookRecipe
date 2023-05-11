import styles from './Modify.module.css';
import MenuList from '../menulist/MenuList';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import {getDoc,doc,updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';

function Modify(){

  let {postDocID} =useParams();
  const auth = getAuth();
  let navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/photoDefualt.gif');


  let 정보가져오기 = async function(){
    const 컬렉션 = collection(db, "post");
    const 문서 = doc(컬렉션, postDocID);
    await getDoc(문서)
    .then((result)=>{
      console.log(result.data())
      document.querySelector('#title').value =result.data().title;
      document.querySelector('#category').value= result.data().category;
      document.querySelector('#content').value = result.data().content;
      document.querySelector('#imgArea img').src = result.data().사진;
    })

    
  }

  // Firebase Storage 초기화
  const storage = getStorage();

  let 요리사진 =async function(photoFile) {

    // Firebase Storage에 이미지 업로드
    const storageRef = ref(storage, 'menuProfiles/' + photoFile.name);
    await uploadBytes(storageRef, photoFile);

    // Firebase Storage에서 이미지 URL 가져오기
    const photoURL = await getDownloadURL(storageRef)

    return photoURL;
  }
  
  
  let 사진미리보기 = function(event){
    const file = event.target.files[0];
    
    if(file==null){
      setImageSrc(process.env.PUBLIC_URL + '/images/photoDefualt.gif');
      return
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }
  
  //수정을 하면 문서 update할 수 있도록 바꾼다.
  let 수정 = async function(){
    let fileImage = document.querySelector('#recipePhoto').files[0];
    let 날짜 = new Date();
    const 수정문서 = doc(db, "post", postDocID);
    console.log(postDocID);
    console.log(수정문서);
    console.log(날짜);
    if(fileImage==null){
      alert('수정된 이미지를 업로드하셈 ㅅㄱ');
      return
    }
    try {
      await 요리사진(fileImage)
      .then((result)=>{
        
        updateDoc(수정문서, {
          title : document.querySelector('#title').value,
          category : document.querySelector('#category').value,
          content : document.querySelector('#content').value,
          작성자 : auth.currentUser.uid,
          수정일 : `${날짜.getFullYear()}년 ${날짜.getMonth()+1}월 ${날짜.getDate()}일`,
          사진 : result
        });
      })
      .then(()=>{
        alert('글 수정 완료!');
        setImageSrc(process.env.PUBLIC_URL + '/images/photoDefualt.gif');
        navigate('/');
      });
      
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('로그인을 하셔야 글 수정이 가능합니다.');
      navigate('/login');
    }
  }



  useEffect(()=>{
    정보가져오기();
    
  },[])
  


  return (
    <div>
      {postDocID}
      <div>
        
      </div>
      <form action="" className={styles.modifyArea}>
        <h1 className={styles.title}>수정 페이지임</h1>
        <div>
          <p>제목</p>
          <input type="text" id="title" placeholder="제목"/>
        </div>
        <div>
          <p>카테고리</p>
          <select name="" id="category">
            <option value=''>-- 선택 --</option>
            {
              MenuList.map((a,i)=>{
                return(
                  <option value={a.route} key={i}>{MenuList[i].title}</option>
                )
              })
            }
          </select>
        </div>

        <div>
        <p>완성된 요리 사진</p>
          <input type="file" id="recipePhoto" onChange={(e)=>{e.preventDefault();사진미리보기(e)}} />
          <div className={styles.profileImg} id='imgArea'>
            {imageSrc && <img src={imageSrc} alt="Preview" />}
          </div>
        </div>

        <div>
          <p>내용</p>
          <textarea name="content" id="content" placeholder='글 내용' cols="30" rows="10"></textarea>
        </div>
        <div>
          <button type="submit" id='send' className="btn btn-outline" onClick={(e)=>{e.preventDefault();수정()}}>글 수정</button>
        </div>
      </form>
    </div>
  )
}

export default Modify;