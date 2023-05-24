import styles from './Start.module.css';

function Start(props){
  return(
    <div className="hero min-h-screen" id={styles.carouselArea} style={{ backgroundImage: `url(${props.캐러셀data.backgroundImage})` }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-4xl font-bold">{props.캐러셀data.head}</h1>
          <p className="mb-5">{props.캐러셀data.content}</p>
        </div>
      </div>
    </div>
  )
}

export default Start;