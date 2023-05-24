import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Start from "./Start";
import data from "./HomeData";


function CarouselArea(){
  let 캐러셀data = data;
  return(
    <Carousel infiniteLoop autoPlay interval="2000" transitionTime="700" showThumbs={false}>

      {캐러셀data.map((a,i)=>{
        return(
          <Start 캐러셀data={캐러셀data[i]} key={i}></Start>
        )
      })}
    </Carousel>
  )
}

export default CarouselArea;