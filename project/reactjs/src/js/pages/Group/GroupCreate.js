import React from 'react'
import GroupForm from '../../components/Group/GroupForm'

function GroupCreate() {
    const data = {}

    return (    
        <div>
            <h2 className="title">Create Group</h2>
            
            <GroupForm data={data} actionType={"create"}/>
        </div>
    )
}  
  
export default GroupCreate  
