import React from "react";
import Pagination from "react-js-pagination";
import './Paging.css'

const Paging = ({page,count,setPage,한페이지당글갯수,표시되는페이지수}) =>{

  return (
    <>
      <Pagination
        activePage={page}
        totalItemsCount={count}
        itemsCountPerPage={한페이지당글갯수}
        pageRangeDisplayed={표시되는페이지수}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={setPage}
      ></Pagination>
    </>
  )
}

export default Paging;