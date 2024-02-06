import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';

const PodCpuMetric = () => {

    const {setInfraActiveTab,setInfraPodActiveTab } = useContext(GlobalContext);

    useEffect(() => {
        setInfraActiveTab(0);
        setInfraPodActiveTab(0);
    }, [])
    
  return (
    <div>PodCpuMetric</div>
  )
}

export default PodCpuMetric