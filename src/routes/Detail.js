import { db } from "../firebase";
import { getDoc,collection, doc , getDocs, deleteDoc } from "firebase/firestore";
import { useState,useEffect } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import styles from './Detail.module.css';
import { useNavigate } from "react-router-dom";


function Detail(){
  let queryString = new URLSearchParams(window.location.search);
  // console.log(queryString.get('id'));
  let [페이지상세정보,페이지상세정보설정] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  let [작성자프로필,작성자프로필설정] = useState('');
  let [현재상태,현재상태설정] =useState('');
  let navigate = useNavigate();
  let [작성자사진,작성자사진설정] = useState('');
  

  let 정보가져오기 = async function(){
    const 컬렉션 = collection(db, "post");
    const 문서 = doc(컬렉션, queryString.get('id'));
    await getDoc(문서)
    .then((result)=>{
      console.log(result.data())
      페이지상세정보설정(result.data());
      return result.data().작성자
    })
    .then((a)=>{
      let data = 작성자사진가져오기(a);
      return data
    })
    .then((result)=>{
      // console.log(result)
      작성자사진설정(result.photo)
    })
    
  }

  let 문서삭제 = async function(){
    const 문서ID = queryString.get('id');

    
    await deleteDoc(doc(db, "post", 문서ID))
    .then(()=>{
      alert('글 삭제 완료');
      navigate('/profile');
    });
  }


  let 작성자정보가져오기 = async function(){
    const 글목록DB = await getDocs(collection(db, "post"));
    let obj={};
    글목록DB.forEach((doc)=>{
      // console.log(doc.id , doc.data())
      obj[doc.id] = doc.data()
    });
    // console.log(obj);
    const asArray = Object.entries(obj);
    // console.log(asArray);

    const filtered = asArray.filter(([key, value]) => key === queryString.get('id'));
    const justStrings = Object.fromEntries(filtered);
    // console.log(justStrings);
    
    const userDocumentID = Object.values(justStrings)[0]; //작성한 글 DB
    // console.log(userDocumentID)
    return userDocumentID
  }


  let 작성자사진가져오기 = async function(a){
    const 회원DB = await getDocs(collection(db, "users"));
    let obj={};
    회원DB.forEach((doc)=>{
      // console.log(doc.id , doc.data())
      obj[doc.id] = doc.data()
    });
    // console.log(obj);
    const asArray = Object.entries(obj);
    console.log(asArray);

    const filtered = asArray.filter(([key, value]) => value.uid === a);
    const justStrings = Object.fromEntries(filtered);

    console.log(justStrings);
    
    const userDocumentID = Object.values(justStrings)[0]; 
    console.log(userDocumentID)
    
    

    return userDocumentID
  }


  useEffect(()=>{
    정보가져오기()

    onAuthStateChanged(auth,(user)=>{
      if(user){
        작성자정보가져오기()
        .then((작성자프로필)=>{
          console.log(작성자프로필)
          console.log(작성자프로필.작성자)
          console.log(user.uid)
          console.log(작성자프로필.작성자 === user.uid);
          작성자프로필설정(작성자프로필)

          if(작성자프로필.작성자===user.uid){
            현재상태설정('작성자')
          } else{
            현재상태설정('로그인방문자')
          }
        })
        
      }

      else{
        현재상태설정('비로그인방문자')
      }




    })
    
    
    
  },[])

  return (
    <div>
      디테일 페이지용
      <p> 게시물 id : {queryString.get('id')}</p>
      <p>title : {페이지상세정보.title}</p>
      <p> category : {페이지상세정보.category}</p>
      <p>작성일 : {페이지상세정보.작성일}</p>
      <p>작성자 : {페이지상세정보.작성자}</p>
      
      {
        현재상태 === '작성자' ?
        <>
        <button className="btn btn-outline" onClick={()=>{navigate(`/modify/${queryString.get('id')}`)}}>수정</button>
        <button className="btn btn-outline" onClick={(e)=>{e.preventDefault();문서삭제()}}>삭제</button>
        </>
        :
        null
      }

      

      {
        작성자프로필 !==null ? 
        <div>
          <p>있는작성자</p>
          <img src={작성자사진} alt="작성자프로필사진" className={styles.uploaderProfile}/>
        </div>
        :
        <>
          <p>탈퇴한 작성자</p>
          <img src={process.env.PUBLIC_URL + '/images/profileDefualt.jpg'} alt="" />
        </>
      }
      
      <div>
        <p>요리사진</p>
        <img src={페이지상세정보.사진} alt="이미지 사진" />
      </div>
      <div>현재상태 : {현재상태}</div>
      {
        현재상태 === '비로그인방문자' ?
        <>
          <p>댓글을 작성하려면 로그인해주세요.</p>
        </>
        :
        <>
          <p>댓글 작성란</p>
        </>
      }
    </div>
  )
}

export default Detail;