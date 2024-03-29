import { useNavigate } from 'react-router-dom';
import styles from './ReAuthentication.module.css';

function ReAuthentication(props){

  let navigate = useNavigate();
  return(
    <div className="modal modal-open" id={styles.reAuthArea}>
      <div className="modal-box">
        <h3 style={{fontSize :'2rem',marginBottom : '20px'}} className="font-bold text-lg">사용자 재인증</h3>
        <div>
          <span>이메일</span>
          <input type="email" value={props.재인증이메일} placeholder='이메일을 다시 입력해주세요.' onChange={(e) => props.재인증이메일설정(e.target.value)}/>
        </div>
        <div>
          <span>비밀번호</span>
          <input type="password" value={props.재인증패스워드} placeholder='비밀번호를 다시 입력해주세요.' onChange={(e) => props.재인증패스워드설정(e.target.value)}/>
        </div>
        <button htmlFor="my-modal" className="btn btn-outline" onClick={(e)=>{props.재인증하기(e)}}>사용자 재인증</button>
        <div className="modal-action">
          <label htmlFor="my-modal-6" className="btn btn-outline" onClick={()=>{navigate('/profile')}}>돌아가기</label>
        </div>
      </div>
    </div>
  )
}

export default ReAuthentication;