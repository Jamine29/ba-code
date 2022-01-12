import React, { useState, useEffect } from 'react'   
import GroupItem from './GroupItem.js' 

function GroupList(props) {
    const [data, setData] = useState(null) 

    useEffect(() => {
        let arrayOfGroups = props.groups.docs.map((item) => {
            if(props.setUpdate !== undefined) {
                return (
                    <GroupItem item={item} showButtons={props.showButtons} key={item._id} setUpdate={props.setUpdate} update={props.update}/>
                )  
            }
            else {
                return (
                    <GroupItem item={item} showButtons={props.showButtons} key={item._id}/>
                )  
            }
        })
        setData(arrayOfGroups) 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.groups]) 

    return(
        <div className="flex-container-column">
            <div className="list-container">
                {data}
            </div>

            { props.showPaginate &&
            <div>
                    <div className="flex-container-row">
                        <div className="flex-container-column margin20">
                            { props.groups.hasNextPage && 
                                <button className="button" onClick={() => props.handleMoreButton()}>Load More</button>
                            }
                        </div>
                    </div>
            </div>
            }
        </div>
    ) 
}

export default GroupList  