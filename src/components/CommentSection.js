import { useState } from "react";
import styles from './CommentSection.module.css';
import { useEffect } from "react";
import Paging from "./Paging";
import { CollectionReference } from "firebase/firestore";


function CommentSection(props) {
  
  const 날짜 = new Date();
  const 페이지id = props.페이지id;
  const 현재로그인유저 = JSON.parse(localStorage.getItem('user'));

  let 이페이지댓글= JSON.parse(localStorage.getItem('comment'));
  let [댓글내용,댓글내용설정] = useState('');
  
  let 해당페이지댓글가져오기 = 이페이지댓글.filter((item)=>{
    return item['페이지id'] == 페이지id
  })
  
  let [댓글목록,댓글목록설정] = useState(해당페이지댓글가져오기);
  
  const [현재페이지,현재페이지설정] = useState(1); // 현재 페이지. default 값으로 1
  const [한페이지당글갯수] = useState(5); // 한 페이지에 보여질 아이템 수   
  let [count,setCount] = useState(0);
  const [글마지막인덱스, 글마지막인덱스설정] = useState(0);
  const [글첫인덱스, 글첫인덱스설정] = useState(0);
  const [현재페이지게시글목록, 현재페이지게시글목록설정] = useState([]);
  const 표시되는페이지수 = 5;

  let [텍스트내용,텍스트내용설정] = useState('');
  
  

  let 댓글추가하기 = function(){
    if(댓글내용==''){
      alert('글 내용을 입력해주세요.');
      return
    }
    
    let 추가할내용 = {
      페이지id : 페이지id,
      댓글작성자 : 현재로그인유저,
      댓글내용 : 댓글내용,
      작성날짜 : `${날짜.getFullYear()}년 ${날짜.getMonth()+1}월 ${날짜.getDate()}일`
    };
    console.log('추가할내용')
    console.log(추가할내용)
    

    이페이지댓글.push(추가할내용);
    

    localStorage.setItem('comment',JSON.stringify(이페이지댓글));
    댓글내용설정('');

    let 해당페이지댓글가져오기 = 이페이지댓글.filter((item)=>{
      return item['페이지id'] == 페이지id
    })
    
    댓글목록설정(해당페이지댓글가져오기);
    

  }

  function 댓글수정기능(e,i){
    e.preventDefault();

    if(document.getElementsByClassName('modifyText')[i].style.display === 'none'){
      document.getElementsByClassName('modifyText')[i].style.display = 'block'
      텍스트내용설정(document.getElementsByClassName('commentText')[i].value)
    }
    else{
      document.getElementsByClassName('modifyText')[i].style.display = 'none'
      텍스트내용설정('')
    }
    


    해당페이지댓글가져오기[i]['댓글내용'] =  텍스트내용;

    let 다른페이지댓글= 이페이지댓글.filter((item)=>{return item['페이지id']!==페이지id});
    이페이지댓글=[...다른페이지댓글,...해당페이지댓글가져오기];
    localStorage.setItem('comment',JSON.stringify(이페이지댓글));
    
    댓글목록설정(해당페이지댓글가져오기);
    
  }

  function 해당댓글삭제하기(e,i){
    e.preventDefault();
    
    console.log('삭제');
    console.log(`${i}번째`)
    let 다른페이지댓글= 이페이지댓글.filter((item)=>{return item['페이지id']!==페이지id});
    댓글목록.splice(i,1);
    
    이페이지댓글=[...다른페이지댓글,...댓글목록];
    localStorage.setItem('comment',JSON.stringify(이페이지댓글));
    

    let comment =JSON.parse(localStorage.getItem('comment'));
    let 해당페이지댓글가져오기 = comment.filter((item)=>{
      return item['페이지id'] == 페이지id
    })
    댓글목록설정(해당페이지댓글가져오기)
    
  }

  useEffect(()=>{
    console.log(현재페이지게시글목록)
  },[])
  

  useEffect(()=>{
    
    setCount(댓글목록.length);
    글마지막인덱스설정(현재페이지 * 한페이지당글갯수);
    글첫인덱스설정(글마지막인덱스 - 한페이지당글갯수);
    현재페이지게시글목록설정(댓글목록.slice(글첫인덱스, 글마지막인덱스));
    

  },[현재페이지, 글마지막인덱스, 글첫인덱스,댓글목록, 한페이지당글갯수])



  

  const setPage = (error) => {
    현재페이지설정(error);
  };


  return (
    <div className={styles.commentArea}>
      <p className={styles.commentCount}>댓글 {현재페이지게시글목록.length}</p> 
      <div className={styles.commentWrite}>
        <textarea placeholder="댓글을 입력해주세요~" id="comment" cols="30" rows="5" value={댓글내용} onChange={(e)=>{댓글내용설정(e.target.value)}}>{텍스트내용}</textarea>
        <button className="btn btn-outline" onClick={댓글추가하기}>글쓰기</button>
        <div style={{clear : 'both'}}></div>
      </div>
      
      {
        현재페이지게시글목록 && 댓글목록.length>0 ?

        <>
          {현재페이지게시글목록.map((a,i)=>{
            return (
              <div key={i}>
                {
                  a['댓글작성자']['uid']== 현재로그인유저['uid'] ?
                  <>
                    <div className={styles.replysection}>
                      <div className={styles.left}>
                        <img className={styles.writerProfile} src={a['댓글작성자']['photoURL']} alt="작성자사진" />
                        <p>{a['댓글작성자']['displayName']} 님</p>
                      </div>
                      <div className={styles.replyContent}>
                        
                        <div>
                          <textarea className='commentText' name={`comment${i+1}`} placeholder={a['댓글내용']} value={a['댓글내용']} disabled></textarea>
                          <textarea className='modifyText' style={{display : 'none', fontWeight : 'bold'}} placeholder="수정할 내용을 입력하세요." value={텍스트내용} onChange={(e)=>{텍스트내용설정(e.target.value)}}></textarea>
                          <div className={styles.buttonArea}>
                            <button className="btn btn-outline" style={{marginRight : '10px'}} onClick={(e)=>{댓글수정기능(e,i)}}>
                              수정
                            </button>
                            <button className="btn btn-outline" onClick={(e)=>{해당댓글삭제하기(e,i)}}>
                              삭제
                            </button>

                          </div>
                        </div>
                      </div>
                      
                    </div>
                    
                  </>
                  :
                  <div className={styles.replysection}>
                    <div className={styles.left}>
                      <img className={styles.writerProfile} src={a['댓글작성자']['photoURL']} alt="작성자사진" />
                      <p>{a['댓글작성자']['displayName']} 님</p>
                    </div>
                    <div className={styles.replyContent}>
                      
                      <div>
                        <textarea className='commentText' name={`comment${i+1}`} defaultValue={a['댓글내용']} disabled></textarea>
                        <textarea className='modifyText' style={{display : 'none', fontWeight : 'bold', visibility : 'hidden'}} placeholder="수정할 내용을 입력하세요." value={텍스트내용} onChange={(e)=>{텍스트내용설정(e.target.value)}}></textarea>
                          <div className={styles.buttonArea} style={{visibility : 'hidden'}}>
                            <button className="btn btn-outline" style={{marginRight : '10px'}} onClick={(e)=>{댓글수정기능(e,i)}}>
                              수정
                            </button>
                            <button className="btn btn-outline" onClick={(e)=>{해당댓글삭제하기(e,i)}}>
                              삭제
                            </button>

                          </div>
                      </div>
                    </div>
                    
                  </div>
                }
              </div>
            )
          })}
          <Paging page={현재페이지} 표시되는페이지수={표시되는페이지수} 한페이지당글갯수={한페이지당글갯수} count={count} setPage={setPage}></Paging>

        </>
        :
        <>
          <p>댓글 없음</p>
        </>
      }
      
    </div>
  );
}

export default CommentSection;