import { db } from "../firebase";
import { getDoc,collection, doc , getDocs, deleteDoc } from "firebase/firestore";
import { useState,useEffect } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import styles from './Detail.module.css';
import { useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { Fa500Px } from "react-icons/fa";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import { Link } from "react-router-dom";

function Detail(){
  let queryString = new URLSearchParams(window.location.search);
  // console.log(queryString.get('id'));
  let [페이지상세정보,페이지상세정보설정] = useState({});
  const auth = getAuth();
  // const user = auth.currentUser;
  let [작성자프로필,작성자프로필설정] = useState('');
  let [현재상태,현재상태설정] =useState('');
  let navigate = useNavigate();
  let [작성자사진,작성자사진설정] = useState('');
  let 현재로그인유저 = JSON.parse(localStorage.getItem('user'));

  const 좋아요클릭 = JSON.parse(localStorage.getItem('like'));
  
  let 좋아요가져오기 = 좋아요클릭.filter((item)=>{return item.페이지id === queryString.get('id') && item.작성자 === 현재로그인유저.uid});
  let [작성자이름,작성자이름설정] = useState('');
  
  if(좋아요가져오기.length==0){
    if(현재로그인유저.uid==='비로그인방문자'){
      let 추가할내용={
        페이지id : queryString.get('id'),
        작성자  : '비로그인방문자',
        좋아요 : false
      }
      좋아요가져오기.push(추가할내용);
      
    }
    else{
      let 추가할내용={
        페이지id : queryString.get('id'),
        작성자  : 현재로그인유저.uid ,
        좋아요 : false
      }
      좋아요가져오기.push(추가할내용);
      좋아요클릭.push(...좋아요가져오기);
      localStorage.setItem('like',JSON.stringify(좋아요클릭));
    }
    
    
  }

  
  const [liked, setLiked] = useState(좋아요가져오기[0].좋아요);


  let 정보가져오기 = async function(){
    const 컬렉션 = collection(db, "post");
    const 문서 = doc(컬렉션, queryString.get('id'));
    await getDoc(문서)
    .then((result)=>{
      console.log(result.data())
      회원정보가져오기(result.data().작성자)
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

    let 댓글모두가져오기 = JSON.parse(localStorage.getItem('comment'));
    let 이페이지댓글제외 = 댓글모두가져오기.filter((comment)=>{
      return comment['페이지id'] !== 문서ID
    })
    localStorage.setItem('comment',JSON.stringify(이페이지댓글제외));

    let 좋아요모두가져오기 = JSON.parse(localStorage.getItem('like'));
    let 이페이지좋아요제외 = 좋아요모두가져오기.filter((like)=>{
      return like['페이지id'] !== 문서ID
    })

    localStorage.setItem('like',JSON.stringify(이페이지좋아요제외));

    
    await deleteDoc(doc(db, "post", 문서ID))
    .then(()=>{
      alert('글 삭제 완료');
      navigate('/profile');
    })
    .catch((e)=>{console.log(e)});
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
    // console.log(asArray);

    const filtered = asArray.filter(([key, value]) => value.uid === a);
    const justStrings = Object.fromEntries(filtered);

    // console.log(justStrings);
    
    const userDocumentID = Object.values(justStrings)[0]; 
    // console.log(userDocumentID)
    
    return userDocumentID
  }

  let 회원정보가져오기 = async function(user){
    const querySnapshot = await getDocs(collection(db, "users"));
    
    querySnapshot.forEach((doc) => {
      if(doc.data().uid === user){
        console.log(doc.data());
        작성자이름설정(doc.data().name);
      }
      
    });
    
  }


  const handleLikeClick = () => {
    setLiked(!liked); // 클릭할 때마다 상태를 반전시킴
    좋아요가져오기[0].좋아요 = !liked;
    localStorage.setItem('like',JSON.stringify(좋아요클릭))
    
  };


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
          console.log(작성자프로필.단계별내용);
          console.log(작성자프로필.단계별추가사진);
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

  // useEffect(()=>{
  //   회원정보가져오기()
  // },[])

  return (
    <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100" id={styles.detailArea}>

      <div className={styles.mainPhoto}>
        <p>대표 요리사진</p>
        <div className={styles.mainPhotoImage}>
          <img src={페이지상세정보.사진} alt="이미지 사진" />
        </div>
        {
          작성자프로필 !==null ? 
          <div className={styles.writerProfile}>
            <img src={작성자사진} alt="작성자프로필사진" className={styles.uploaderProfile}/>
            <p style={{fontWeight : '700'}}>작성자 : {작성자이름}님</p>
          </div>
          :
          <>
            <p>탈퇴한 작성자</p>
            <img src={process.env.PUBLIC_URL + '/images/profileDefualt.jpg'} alt="기본프로필" />
          </>
        }
      </div>

      <div>
        {
          현재상태 !== '비로그인방문자' ?
          <>
            <button onClick={handleLikeClick} className={styles.like}>
              {liked==0 ? 
              <AiOutlineHeart style={{ fontSize: '50px' }}></AiOutlineHeart>
              : 
              <AiFillHeart style={{ fontSize: '50px' , color : 'red'}}></AiFillHeart>
              }
            </button>
          </>
          :
          null
        }
      </div>

      <div className={styles.detailInfoArea}>
        <h1>제목 : {페이지상세정보.title}</h1>
        <h2>내용 : {페이지상세정보.content}</h2>
        <p>
          카테고리 : <button className="btn btn-ghost" onClick={()=>{navigate(`/recipe/${페이지상세정보.category}`)}}>{페이지상세정보.category}</button>
        </p>
        
        <p>작성일 : {페이지상세정보.작성일}</p>
        {
          페이지상세정보.수정일 ?
          <>
            <p>수정일 : {페이지상세정보.수정일}</p>
          </>
          :
          null
        }

        {
          현재상태 === '작성자' ?
          <div className={styles.btnArea}>
          <button className="btn btn-outline" onClick={()=>{navigate(`/modify/${queryString.get('id')}`)}}>수정</button>
          <div style={{width : '30px'}}></div>
          <button className="btn btn-outline">
            <label htmlFor="my-modal-6"><a>삭제</a></label>
          </button>
          </div>
          :
          null
        }
      </div>

      <hr />
      
      
      
      

      <div className={styles.stepArea}>
        {
          페이지상세정보.단계별내용 !==undefined ?
          
          페이지상세정보.단계별내용.map((a,i)=>{
            return(
              <div key={i}>
                <div className={styles.stepByStep}>
                  <div className={styles.stepNumber}>{i+1}</div>
                  <p>{페이지상세정보.단계별내용[i] ? 페이지상세정보.단계별내용[i] : <>내용을 입력해주세요.</>}</p>
                  <div style={{grow : '1'}}></div>
                </div>
                <div>
                  <img className={styles.stepphoto} src={페이지상세정보.단계별추가사진[i] ? 페이지상세정보.단계별추가사진[i] : process.env.PUBLIC_URL + '/images/addPhoto.gif'} alt={`단계${i+1}사진`} />
                </div>
                <hr />
              </div>
            )
          })
          :
          null
        }
      </div>
      

      

      {
        현재상태 === '비로그인방문자' ?
        <>
          <p>댓글을 작성하려면 로그인해주세요.</p>
        </>
        :
        <>
          <CommentSection 페이지id={queryString.get('id')}></CommentSection>
        </>
      }
      
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">문서 삭제</h3>
          <p className="py-4" style={{textAlign : 'center'}}>이 문서를 삭제하시면 다시 복구하실 수 없습니다.<br />그래도 진행하시겠습니까?</p>
          <div className="modal-action flex justify-center">
            <label htmlFor="my-modal-6" className="btn btn-outline" onClick={()=>{문서삭제()}}>예</label>
            <label htmlFor="my-modal-6" className="btn btn-outline" onClick={()=>{navigate(`/detail?id=${queryString.get('id')}`)}}>아니오</label>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Detail;

