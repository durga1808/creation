import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';

const NodeMemoryMetric = () => {

    const {setInfraActiveTab,setInfraNodeActiveTab } = useContext(GlobalContext);

    useEffect(() => {
        setInfraActiveTab(1);
        setInfraNodeActiveTab(1);
    }, [])


  return (
    <div>NodeMemoryMetric</div>
  )
}

export default NodeMemoryMetric