import React from 'react' 
import { Link } from 'react-router-dom' 

function Home() {
    return(
        <div className="flex-container-column height100">
            <p className="home-text">Find your Korean Idol.</p>

            <Link to="/search" className="button">
                Go
            </Link>
        </div>
    )
}

export default Home