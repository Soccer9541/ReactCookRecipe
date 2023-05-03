import { useNavigate } from 'react-router-dom';
import styles from './MenuItem.module.css';

function MenuItem(props){

  let navigate = useNavigate();

  return(
    <div className="card w-96 bg-base-100 shadow-xl sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" onClick={()=>{navigate(`/recipe/${props.route}`)}}>
      <figure><img src={props.img} alt="Shoes" style={{borderBottom : '1px solid black'}} /></figure>
      <div className="card-body">
        <h2 className="card-title justify-center">
          {props.title}
        </h2>
      </div>
    </div>
  )
}

export default MenuItem;