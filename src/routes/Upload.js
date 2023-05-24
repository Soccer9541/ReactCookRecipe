import styles from './Upload.module.css';
import MenuList from '../menulist/MenuList';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react';
import { useRef } from 'react';

function Upload(){
  
  const auth = getAuth();
  let navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/photoDefualt.gif');

  let [요리대표사진,요리대표사진설정]=useState('');
  let 날짜 = new Date();

  let [박스추가,박스추가설정] = useState([]);
  let [단계별내용,단계별내용설정] = useState([]);

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
  
  
  let 전송 = async function(){
    let fileImage = document.querySelector('#recipePhoto').files[0];
    if(fileImage==null){
      alert('이미지를 업로드해라 ㅅㄱ');
      return
    }

    
    try {
      await 요리사진(fileImage)
      .then((result)=>{
        
        addDoc(collection(db, "post"), {
          title : document.querySelector('#title').value,
          category : document.querySelector('#category').value,
          content : document.querySelector('#content').value,
          작성자 : auth.currentUser.uid,
          작성일 : `${날짜.getFullYear()}년 ${날짜.getMonth()+1}월 ${날짜.getDate()}일`,
          사진 : result,
          단계별추가사진 : 박스추가,
          단계별내용 : 단계별내용
        })
      })
      .then(()=>{
        alert('글 작성 완료!');
        
        setImageSrc(process.env.PUBLIC_URL + '/images/photoDefualt.gif');
        요리대표사진설정('');
        navigate('/recipe');
      });
      
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('로그인을 하셔야 글 작성이 가능합니다.');
      navigate('/login');
    }

  }

  let 단계추가 = async function(){
    console.log('단계추가용');
    let copy =[...박스추가];
    copy.push('');
    박스추가설정(copy);

    let copy2 =[...단계별내용];
    copy2.push('');
    단계별내용설정(copy2);
  }


  let 단계추가삭제 = (e,i)=>{
    e.preventDefault();
    console.log(i)
    console.log('삭제');
    let copy=[...박스추가];
    copy.splice(i,1);
    박스추가설정(copy);

    let copy2=[...단계별내용];
    copy2.splice(i,1);
    단계별내용설정(copy2);

    document.getElementsByClassName('contentRecipe')[i].value='';
    document.getElementsByClassName('previewPhoto')[i].value='';
  }


  let 요리단계사진추가 = async (e,i) =>{
    e.preventDefault();
    const file=e.target.files[0];
    console.log(i)
    console.log(file);
    if(file==null){
      let copy=[...박스추가];
      copy[i]='';
      박스추가설정(copy);
      console.log('test');
      return
    }
    const reader = new FileReader();
    reader.onloadend = () => {
    };
    reader.readAsDataURL(file);
    try{
      await 요리사진(file)
      .then((result)=>{
        let copy=[...박스추가];
        copy[i]=result;
        박스추가설정(copy);
        
      })
    }
    catch(e){
      console.error("Error adding document: ", e);
    }
    

  }

  let 요리단계글추가 = (e,i) =>{
    e.preventDefault();
    let copy = [...단계별내용];
    copy[i] = e.target.value;
    단계별내용설정(copy);
    
  }

  return (
    <div>
      <form className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" id={styles.uploadArea}>
        <h1 className={styles.title}>나의 레시피</h1>
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
          <div className={styles.profileImg}>
            {imageSrc && <img src={imageSrc} alt="Preview" />}
          </div>
        </div>

        <div>
          <p>내용</p>
          <textarea name="content" id="content" placeholder='레시피에 대한 간단한 설명을 작성해주세요~' cols="30" rows="10"></textarea>
        </div>
        <div style={{marginBottom : '20px'}}>
          <button className='btn btn-outline' onClick={(e)=>{e.preventDefault();단계추가()}}>단계추가하기</button>
        </div>
        <hr />
        <div>
          {
            박스추가.map((a,i)=>{

              return(
                <div key={i}>
                  <div className='flex mt-4 mb-4 items-center'>
                    <p className={styles.step}>STEP{i+1}</p>
                    <div className='grow'></div>
                    <button className="btn btn-square btn-outline" onClick={(e)=>{단계추가삭제(e,i)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <input type="file" accept="image/*" className='previewPhoto' onChange={(e)=>{요리단계사진추가(e,i)}}  />
                  <div className={styles.addPhoto}>
                    {
                      process.env.PUBLIC_URL + '/images/addPhoto.gif' &&
                      <img src={박스추가[i] ? 박스추가[i]: process.env.PUBLIC_URL + '/images/addPhoto.gif'} alt='preview' />
                    }
                  </div>
                  <textarea name=""  cols="30" rows="10" className='contentRecipe' onChange={(e)=>{요리단계글추가(e,i)}}></textarea>
                  <hr />
                </div>
              )
            })
          }
        </div>
        <div style={{marginTop : '20px'}}>
          <button type="submit" id='send' className="btn btn-primary" onClick={(e)=>{e.preventDefault();전송()}}>작성</button>
        </div>
      </form>
    </div>
  )
}



export default Upload;