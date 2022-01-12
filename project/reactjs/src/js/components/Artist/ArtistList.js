import React, { useState, useEffect } from 'react' 
import ArtistItem from './ArtistItem'

function ArtistList(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        let arrayOfArtists = props.artists.docs.map((item) => {
            if(props.setUpdate !== undefined) {
                return (
                    <ArtistItem item={item} showButtons={props.showButtons} key={item._id} setUpdate={props.setUpdate} update={props.update}/>
                ) 
            }
            else {
                return (
                    <ArtistItem item={item} showButtons={props.showButtons} key={item._id}/>
                ) 
            }
        })
        setData(arrayOfArtists)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.artists])
    

    return(
        <div className="flex-container-column">
            <div className="list-container">
                { data }
            </div>
            <div>
                { props.showPaginate &&
                    <div className="flex-container-row">
                        <div className="flex-container-column margin20">
                            { props.artists.hasNextPage && 
                                <button className="button" onClick={() => props.handleMoreButton()}>Load More</button>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ArtistList 