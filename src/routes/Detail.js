import { db } from "../firebase";
import { getDoc,collection, doc , getDocs } from "firebase/firestore";
import { useState,useEffect } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import styles from './Detail.module.css';

function Detail(){
  let queryString = new URLSearchParams(window.location.search);
  // console.log(queryString.get('id'));
  let [페이지상세정보,페이지상세정보설정] = useState({});
  let auth = getAuth();
  let user = auth.currentUser;
  let [작성자프로필,작성자프로필설정] = useState('');
  let [현재상태,현재상태설정] =useState('');

  let 정보가져오기 = async function(){
    const 컬렉션 = collection(db, "post");
    const 문서 = doc(컬렉션, queryString.get('id'));
    await getDoc(문서)
    .then((result)=>{
      // console.log(result.data());
      페이지상세정보설정(result.data());
      return result.data().작성자
    })
    .then((a)=>{
      // console.log(a);
      let b = 작성자정보가져오기(a);
      return b
    })
    .then((result)=>{
      // console.log(result)
      // console.log(result==null);
      if(result==null){
        작성자프로필설정(null);
        return
      }
      작성자프로필설정(result);
    })

    
  }

  let 작성자정보가져오기 = async function(a){
    const querySnapshot = await getDocs(collection(db, "users"));
    let array=[];
    querySnapshot.forEach((doc)=>{
      array.push(doc.data())
    });
    
    let 찾는거 = array.filter((item)=>{
      return item.uid === a
    })
    
    return 찾는거[0]
  }
  


  useEffect(()=>{
    정보가져오기()
    onAuthStateChanged(auth,(user)=>{
      // console.log(user.uid)
      // console.log(작성자프로필)
      // console.log(작성자프로필.uid===user.uid)
      if(user){
        if(작성자프로필==null){
          현재상태설정('로그인방문자')
          return
        }

        if(작성자프로필.uid===user.uid){
          현재상태설정('작성자')
        } else{
          현재상태설정('로그인방문자')
        }
      }
      else{
        if(작성자프로필==null){현재상태설정('비로그인방문자');return}
        현재상태설정('비로그인방문자')
      }
    })
    
    
  })

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
        <button className="btn btn-outline">수정</button>
        <button className="btn btn-outline">삭제</button>
        </>
        :
        null
      }

      {
        작성자프로필 !==null ? 
        <div>
          <p>있는작성자</p>
          <img src={작성자프로필.photo} alt="작성자프로필사진" className={styles.uploaderProfile}/>
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