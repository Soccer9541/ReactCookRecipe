import { useEffect } from "react";
import Paging from "../components/Paging";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MyLike.module.css';
import { getDocs,collection } from "firebase/firestore";
import { db } from "../firebase";

function MyLike(){

  let 로그인유저 = JSON.parse(localStorage.getItem('user'));
  let 좋아요목록 = JSON.parse(localStorage.getItem('like'));
  let 댓글목록 = JSON.parse(localStorage.getItem('comment'));

  let 내가찜한목록 = 좋아요목록.filter((item)=>{
    return item.작성자 == 로그인유저.uid && item.좋아요 == true
  })

  let [내글정보,내글정보설정]=useState([]);
  const [현재페이지,현재페이지설정] = useState(1); // 현재 페이지. default 값으로 1
  const [한페이지당글갯수] = useState(5); // 한 페이지에 보여질 아이템 수   
  let [count,setCount] = useState(0);
  const [글마지막인덱스, 글마지막인덱스설정] = useState(0);
  const [글첫인덱스, 글첫인덱스설정] = useState(0);
  const [현재페이지게시글목록, 현재페이지게시글목록설정] = useState([]);
  const 표시되는페이지수 = 5;
  let navigate = useNavigate();

  

  let FB정보가져오기 = async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      let 사본 = {...doc.data()};
      사본.페이지id=doc.id;
      array.push(사본);
    });
    let copy =[...array]; // 전체 게시글 목록
    
    let myList=[];
    copy.forEach((item)=>{
      내가찜한목록.forEach((a)=>{
        if(a.페이지id==item.페이지id){
          myList.push(item)
        }
      })
    })
    

    
    myList.sort(function(a, b) {
      // 날짜를 추출하기 위해 문자열에서 "년", "월", "일"을 제거
      var dateA = new Date(a.작성일.replace(/년|월|일/g, ''));
      var dateB = new Date(b.작성일.replace(/년|월|일/g, ''));
      
      // 작성일 순서대로 배열 배치
      return dateA - dateB;
    });

    
    

    내글정보설정(myList);

  }
  useEffect(()=>{FB정보가져오기()},[])

  useEffect(()=>{
    console.log(로그인유저)
    console.log(내가찜한목록)
    console.log(내글정보)
    
  })

  useEffect(()=>{
    
    setCount(내글정보.length);
    글마지막인덱스설정(현재페이지 * 한페이지당글갯수);
    글첫인덱스설정(글마지막인덱스 - 한페이지당글갯수);
    현재페이지게시글목록설정(내글정보.slice(글첫인덱스, 글마지막인덱스));
  },[현재페이지, 글마지막인덱스, 글첫인덱스, 내글정보, 한페이지당글갯수])

  const setPage = (error) => {
    현재페이지설정(error);
  };


  
  return(
    <div className={styles.myLikeArea}>
      {
        현재페이지게시글목록 && 내글정보.length > 0 ?
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
                    
                    <div className={styles.heartArea}>
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
        <div className={styles.myLikeArea}>
          <p>좋아요를 누른 글이 없습니다.</p>
          <button className="btn btn-primary" onClick={()=>{navigate('/recipe')}}>메뉴 페이지로</button>
        </div>
      }
    </div>
  )
}

export default MyLike;