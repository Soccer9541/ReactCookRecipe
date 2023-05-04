import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MyPost.module.css';

function MyPost(){
  const auth = getAuth();
  let [내글정보,내글정보설정]=useState([]);
  let navigate = useNavigate();
  
  let FB정보가져오기 = async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    let copy =[...array];
    let myList= copy.filter((item)=>{
      return item.작성자 === auth.currentUser.uid;
    })
    내글정보설정(myList);

  }

  let 로그인유저 = function(){
    console.log(auth.currentUser.uid)
  }



  useEffect(()=>{
    
    FB정보가져오기();
    onAuthStateChanged(auth,(user)=>{
      if(!user){
        signOut(auth).then(()=>{
          navigate('/');
        })
      }
    })

  })

  return (
    <div>
      <p>내가 쓴 글 목록 페이지임.</p>
      <button id='loginUser' className="btn btn-outline" onClick={(e)=>{e.preventDefault();로그인유저()}}>지금 로그인한 유저 정보</button>
      <p>내글목록</p>
      
      {
        내글정보.map((a,i)=>{
          
          return (
            <div key={i}>
              <div className={styles.product}>
                <div className={styles.thumbnail}>
                  <img src={a.사진} alt="요리대표사진" />
                </div>
                <div className="flex-grow-1 p-4">
                  <h5 className="title"> 제목 : {a.title}</h5>
                  <p>카테고리 : {a.category}</p>
                  <p>내용 : {a.content}</p>
                  <p>작성자 : {a.작성자}</p>
                  <p>작성일 : {a.작성일}</p>
                </div>
              </div>
          
              
            </div>
          )
        })
      }
      
    </div>
  )
}



export default MyPost;