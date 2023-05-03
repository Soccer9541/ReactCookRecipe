import { Outlet,  } from "react-router-dom";

function Recipe(){
  
  return (
    <div>
      <h2>메뉴 페이지요</h2>
      <Outlet></Outlet>
      
    </div>
  )
}

export default Recipe;