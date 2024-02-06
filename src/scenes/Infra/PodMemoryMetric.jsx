import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../global/globalContext/GlobalContext';

export const PodMemoryMetric = () => {

    const {setInfraActiveTab,setInfraPodActiveTab } = useContext(GlobalContext);

    useEffect(() => {
        setInfraActiveTab(0);
        setInfraPodActiveTab(1);
    }, [])
  return (
    <div>PodMemoryMetric</div>
  )
}
