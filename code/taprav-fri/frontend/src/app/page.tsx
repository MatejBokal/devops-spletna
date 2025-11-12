import HomepageGrid from "@/components/HomepageGrid";
import NovickePrijava from "@/components/NovickePrijava";


const Home = () => {
  return (
      <div className="flex flex-col justify-center text-center">
          <HomepageGrid />
          <NovickePrijava />
      </div>
  )
}

export default Home;