import React from 'react'
import ArtistForm from '../../components/Artist/ArtistForm'

function ArtistCreate() {
    const data = {}

    return (
        <div>
            <h2 className="title">Create Artist</h2>
            
            <ArtistForm data={data} actionType={"create"}/>
        </div>
    )
} 
  
export default ArtistCreate 
