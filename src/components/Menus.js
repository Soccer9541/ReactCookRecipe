import styles from './Menus.module.css';
import MenuList from '../menulist/MenuList';
import MenuItem from './MenuItem';

function Menus(){

  return (
    <div className={styles.menusArea}>
      {
        MenuList.map((a,i)=>{
          return(
            <MenuItem title={MenuList[i].title} img={MenuList[i].img} route={MenuList[i].route} key={i}></MenuItem>
          )
        })
      }
    </div>
  )

};



export default Menus;