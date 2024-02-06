import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';

const NodeCpuMetric = () => {

    const {setInfraActiveTab,setInfraNodeActiveTab } = useContext(GlobalContext);

    useEffect(() => {
        setInfraActiveTab(1);
        setInfraNodeActiveTab(0);
      
    }, [])

  return (
    <div>NodeCpuMetric</div>
  )
}

export default NodeCpuMetric