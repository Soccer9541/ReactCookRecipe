import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MyPost.module.css';
import Paging from "../components/Paging";

function MyPost(){
  const auth = getAuth();
  let [내글정보,내글정보설정]=useState([]);
  const [현재페이지,현재페이지설정] = useState(1); // 현재 페이지. default 값으로 1
  const [한페이지당글갯수] = useState(5); // 한 페이지에 보여질 아이템 수   
  let [count,setCount] = useState(0);
  const [글마지막인덱스, 글마지막인덱스설정] = useState(0);
  const [글첫인덱스, 글첫인덱스설정] = useState(0);
  const [현재페이지게시글목록, 현재페이지게시글목록설정] = useState([]);
  const 표시되는페이지수 = 5;
  let navigate = useNavigate();

  let 좋아요목록 = JSON.parse(localStorage.getItem('like'));
  let 댓글목록 = JSON.parse(localStorage.getItem('comment'));
  let 현재유저 = JSON.parse(localStorage.getItem('user'));
  
  let FB정보가져오기 = async function(){
    let array =[];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      let 사본 = {...doc.data()};
      사본.페이지id=doc.id;
      array.push(사본);
    });
    let copy =[...array];
    
    let myList= copy.filter((item)=>{
      return item.작성자 === auth.currentUser.uid;
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

  },[])

  useEffect(()=>{
    
    setCount(내글정보.length);
    글마지막인덱스설정(현재페이지 * 한페이지당글갯수);
    글첫인덱스설정(글마지막인덱스 - 한페이지당글갯수);
    현재페이지게시글목록설정(내글정보.slice(글첫인덱스, 글마지막인덱스));
  },[현재페이지, 글마지막인덱스, 글첫인덱스, 내글정보, 한페이지당글갯수])

  const setPage = (error) => {
    현재페이지설정(error);
  };

  return (
    <div className={styles.myPostArea}>
      
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
        <div className={styles.myPostArea}>
          <p>작성한 글이 없습니다.</p>
          <div style={{display : 'flex', justifyContent : 'center'}}>
            <button className="btn btn-primary" onClick={()=>{navigate('/recipe')}}>메뉴 페이지로</button>
            <div style={{width : '30px'}}></div>
            {
              현재유저.uid !== '비로그인방문자' ?
              <>
                <button className="btn btn-outline" onClick={()=>{navigate('/write')}}>글 작성하기</button>
              </>
              :
              null
            }
          </div>
        </div>
      }

    </div>
  )
}



export default MyPost;