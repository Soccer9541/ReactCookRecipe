import { useParams } from "react-router-dom";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../firebase";
import { useState,useEffect } from "react";
import styles from './Recipe.module.css';


function Recipe(){
  
  let {category} =useParams();

  let [카테고리별글목록,카테고리별글목록설정]=useState([]);

  let FB글목록= async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    let copy =[...array];
    let myList= copy.filter((item)=>{
      return item.category === category;
    })
    카테고리별글목록설정(myList);
  }

  useEffect(()=>{
    FB글목록();
  },[])

  return (
    <div>
      <h2>메뉴 페이지요</h2>

      {
        카테고리별글목록.map((a,i)=>{
          
          return (
            <div key={i}>
              <div className={styles.product}>
                <div className={styles.thumbnail}>
                  <img src={a.사진} alt="요리사진" />
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

export default Recipe;