import { getAuth } from "firebase/auth";
import { Outlet, useParams } from "react-router-dom";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../firebase";
import { useState,useEffect } from "react";
import styles from './Recipe.module.css';
import MenuList from '../menulist/MenuList';

function Recipe(){
  
  let {category} =useParams();
  console.log(category);

  const auth = getAuth();
  let [카테고리별글목록,카테고리별글목록설정]=useState([]);

  let FB글목록= async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    console.log(array);
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
      <Outlet></Outlet>
      {
        카테고리별글목록.map((a,i)=>{
          
          return (
            <div key={i}>
              <div className={styles.product}>
                <div className={styles.thumbnail}>
                  <img src='https://via.placeholder.com/350' alt="" />
                </div>
                <div className="flex-grow-1 p-4">
                  <h5 className="title"> 제목 : {a.title}</h5>
                  <p>카테고리 : {a.category}</p>
                  <p>내용 : {a.content}</p>
                  <p>작성자 : {a.작성자}</p>
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