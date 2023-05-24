import { useParams } from "react-router-dom";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../firebase";
import { useState,useEffect } from "react";
import styles from './Recipe.module.css';
import { useNavigate } from "react-router-dom";
import Paging from "../components/Paging";
import {AiFillHeart} from "react-icons/ai";

function Recipe(){
  
  let {category} =useParams();
  let navigate = useNavigate();
  let [카테고리별글목록,카테고리별글목록설정]=useState([]);
  const [현재페이지,현재페이지설정] = useState(1); // 현재 페이지. default 값으로 1
  const [한페이지당글갯수] = useState(5); // 한 페이지에 보여질 아이템 수   
  let [count,setCount] = useState(0);
  const [글마지막인덱스, 글마지막인덱스설정] = useState(0);
  const [글첫인덱스, 글첫인덱스설정] = useState(0);
  const [현재페이지게시글목록, 현재페이지게시글목록설정] = useState([]);
  const 표시되는페이지수 = 5;

  let 좋아요목록 = JSON.parse(localStorage.getItem('like'));
  let 댓글목록 = JSON.parse(localStorage.getItem('comment'));

  let FB글목록= async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      let 사본 = {...doc.data()};
      사본.페이지id=doc.id;
      array.push(사본);
    });
    let copy =[...array];
    let myList= copy.filter((item)=>{
      return item.category === category;
    })

    myList.sort(function(a, b) {
      // 날짜를 추출하기 위해 문자열에서 "년", "월", "일"을 제거
      var dateA = new Date(a.작성일.replace(/년|월|일/g, ''));
      var dateB = new Date(b.작성일.replace(/년|월|일/g, ''));
      
      // 작성일 순서대로 배열 배치
      return dateA - dateB;
    });

    카테고리별글목록설정(myList);
  }

  useEffect(()=>{
    FB글목록();
  },[])

  useEffect(()=>{
    
    setCount(카테고리별글목록.length);
    글마지막인덱스설정(현재페이지 * 한페이지당글갯수);
    글첫인덱스설정(글마지막인덱스 - 한페이지당글갯수);
    현재페이지게시글목록설정(카테고리별글목록.slice(글첫인덱스, 글마지막인덱스));
  },[현재페이지, 글마지막인덱스, 글첫인덱스, 카테고리별글목록, 한페이지당글갯수])

  const setPage = (error) => {
    현재페이지설정(error);
  };

  return (
    <div className={styles.recipeArea}>
      {
        현재페이지게시글목록 && 카테고리별글목록.length > 0 ?
        <div>
          {현재페이지게시글목록.map((a,i)=>{
            let countHeart=0;
            let countComment=0;
            좋아요목록.forEach((item,i)=>{
              if(item.페이지id==a.페이지id && item.좋아요==true){
                  countHeart+=1;
              }
            })
            댓글목록.forEach((item,i)=>{
              if(item.페이지id==a.페이지id){
                countComment+=1;
              }
            })
            
            return (
              <div onClick={()=>{navigate(`/detail?id=${a.페이지id}`)}} key={i}>
                <div className={styles.product}>
                  <div className={styles.thumbnail}>
                    <img src={a.사진} alt="요리대표사진" />
                  </div>
                  <div className={styles.productContent}>
                    <h5 className="title"> 제목 : {a.title}</h5>
                    <p>카테고리 : {a.category}</p>
                    <p>작성일 : {a.작성일}</p>
                    <div className={styles.iconArea}>
                      <span className={styles.heart}>❤</span> : {countHeart}
                      <span className={styles.comment}>💭 : {countComment}</span> 
                    </div>
                    
                  </div>
                </div>
              </div>
            )
          })}
          <Paging page={현재페이지} 표시되는페이지수={표시되는페이지수} 한페이지당글갯수={한페이지당글갯수} count={count} setPage={setPage}></Paging>
        </div>
        :
        <div className={styles.recipeArea}>
          <p>작성된 글이 없습니다.</p>
          <button className="btn btn-primary" onClick={()=>{navigate('/recipe')}}>메뉴 페이지로</button>
        </div>
      }
    </div>
  )
}

export default Recipe;