import { db } from "../firebase";
import { getDoc,collection, doc } from "firebase/firestore";
import { useState,useEffect } from "react";
import { getAuth} from "firebase/auth";

function Detail(){
  let queryString = new URLSearchParams(window.location.search);
  console.log(queryString.get('id'));
  let [페이지상세정보,페이지상세정보설정] = useState({});
  let auth = getAuth();

  let 정보가져오기 = async function(){
    const 컬렉션 = collection(db, "post");
    const 문서 = doc(컬렉션, queryString.get('id'));
    await getDoc(문서)
    .then((result)=>{console.log(result.data());페이지상세정보설정(result.data())})
    
  }

  let 작성자정보가져오기 = async function(){


  }
  
  useEffect(()=>{
    정보가져오기();
    
  },[])

  return (
    <div>
      디테일 페이지용
      <p> 게시물 id : {queryString.get('id')}</p>
      <p>title : {페이지상세정보.title}</p>
      <p> category : {페이지상세정보.category}</p>
      <p>작성일 : {페이지상세정보.작성일}</p>
      <p>작성자 : {페이지상세정보.작성자}</p>
      <div>
        <img src={페이지상세정보.사진} alt="이미지 사진" />
      </div>
    </div>
  )
}

export default Detail;