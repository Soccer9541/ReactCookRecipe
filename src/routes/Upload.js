import styles from './Upload.module.css';
import MenuList from '../menulist/MenuList';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Upload(){
  
  const auth = getAuth();
  let navigate = useNavigate();
  
  
  let 전송 = async function(){
    try {
      const docRef = await addDoc(collection(db, "post"), {
        title : document.querySelector('#title').value,
        category : document.querySelector('#category').value,
        content : document.querySelector('#content').value,
        작성자 : auth.currentUser.uid
      })
      .then(()=>{
        alert('글 작성 완료!');
        navigate('/');
      });
      
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('로그인을 하셔야 글 작성이 가능합니다.');
      navigate('/login');
    }
  }

  return (
    <div>
      
      <form action="" className={styles.uploadArea}>
        <h1 className={styles.title}>글 작성 페이지임</h1>
        <div>
          <p>제목</p>
          <input type="text" id="title" placeholder="제목"/>
        </div>
        <div>
          <p>카테고리</p>
          <select name="" id="category">
            <option value=''>-- 선택 --</option>
            {
              MenuList.map((a,i)=>{
                return(
                  <option value={a.route} key={i}>{MenuList[i].title}</option>
                )
              })
            }
          </select>
        </div>
        <div>
          <p>내용</p>
          <textarea name="content" id="content" placeholder='글 내용' cols="30" rows="10"></textarea>
        </div>
        <div>
          <button type="submit" id='send' className="btn btn-outline" onClick={(e)=>{e.preventDefault();전송()}}>올리기</button>
        </div>
      </form>
    </div>
  )
}



export default Upload;