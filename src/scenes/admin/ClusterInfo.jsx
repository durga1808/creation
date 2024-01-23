import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  changeToInstrument,
  changeToUninstrument,
  getClusterListAllProjects,
} from "../../api/ClusterApiService";
import Loading from "../../global/Loading/Loading";

const data = [
  {
    deploymentName: "openmetadata",
    instrumented: "false",
    namespaceName: "datamesh-space",
  },
  {
    deploymentName: "zaga-airflow-db-migrations",
    instrumented: "false",
    namespaceName: "datamesh-space",
    serviceName: "airflow",
  },
  {
    deploymentName: "zaga-airflow-pgbouncer",
    instrumented: "false",
    namespaceName: "datamesh-space",
    serviceName: "airflow",
  },
  {
    deploymentName: "zaga-airflow-scheduler",
    instrumented: "false",
    namespaceName: "datamesh-space",
    serviceName: "airflow",
  },

  {
    deploymentName: "observai-persistent-entity-operator",
    instrumented: "false",
    namespaceName: "kafka-space",
  },

  {
    deploymentName: "observai-indigo-ui",
    instrumented: "false",
    namespaceName: "observai-main",
    serviceName: "observai-indigo-ui",
  },

  {
    deploymentName: "observai-query-api",
    instrumented: "false",
    namespaceName: "observai-main",
    serviceName: "observai-query-api",
  },
  {
    deploymentName: "observai-ui",
    instrumented: "false",
    namespaceName: "observai-main",
    serviceName: "observai-ui",
  },
  {
    deploymentName: "order-srv-1",
    instrumented: "true",
    namespaceName: "observai-main",
    serviceName: "order-srv-1",
  },
  {
    deploymentName: "order-srv-2",
    instrumented: "false",
    namespaceName: "mongodb-space",
    serviceName: "order-srv-2",
  },
  {
    deploymentName: "vendor-srv-1",
    instrumented: "true",
    namespaceName: "observai-main",
    serviceName: "vendor-srv-1",
  },
  {
    deploymentName: "vendor-srv-1",
    instrumented: "true",
    namespaceName: "minio-operator",
    serviceName: "vendor-srv-1",
  },
  {
    deploymentName: "vendor-srv-1",
    instrumented: "true",
    namespaceName: "metallb-system",
    serviceName: "vendor-srv-1",
  },
];

const ClusterInfo = () => {
  const [data2, setData] = useState([]);
  const [namespaceOptions, setNamespaceOptions] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("observai-main");
  const [selectedInstrumented, setSelectedInstrumented] = useState("all");
  const [loading, setLoading] = useState(false);
  const [InstrumentLoading,setInstrumentLoading]= useState(false);
  const [changeInstrument, setChangeInstrument] = useState(false);
  const [instrument,setInstrument]=useState('');


  useEffect(() => {
    console.log("clusterdetailUseeffectCalled");
    console.log("changeInstrument", changeInstrument);

    const uniqueNamespaces = [
      ...new Set(data.map((item) => item.namespaceName)),
    ];
    setNamespaceOptions(uniqueNamespaces);
    const responseData = async () => {
      setLoading(true);
      try {
        const response = await getClusterListAllProjects();
        console.log(response, "response");
        setData(response);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    // Call the async function immediately
    responseData();
  }, [changeInstrument]);

  const filteredData =
    data2.length > 0 &&
    data2.filter(
      (item) =>
        (selectedNamespace === "all" ||
          item.namespaceName === selectedNamespace) &&
        (selectedInstrumented === "all" ||
          item.instrumented === selectedInstrumented)
    );

  const handleNamespaceChange = (event) => {
    setSelectedNamespace(event.target.value);
  };

  const handleInstrumentedChange = (event) => {
    setSelectedInstrumented(event.target.value);
  };
  const handleInstrument = async (deploymentName, namespace) => {
    setInstrumentLoading(true);
  const instrumentresponse=  await changeToInstrument(namespace, deploymentName);

  setInstrument(instrumentresponse.data);
    setInstrumentLoading(false);
    if(instrumentresponse.status===200){
      setChangeInstrument(!changeInstrument);
    }else{
      alert("Instrumentation Error: Something went wrong with the instrumentation.")
    }
    
  };

  const handleUnInstrument = async (deploymentName, namespace) => {
    setInstrumentLoading(true);
    const instrumentresponse=await changeToUninstrument(namespace, deploymentName);
  
  setInstrument(instrumentresponse.data);
    setInstrumentLoading(false);
    if(instrumentresponse.status===200){
      setChangeInstrument(!changeInstrument);
    }else{
      alert("Instrumentation Error: Something went wrong with the instrumentation.")
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) :
      //  filteredData.length > 0 ?
        (
          <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px",
            }}
          >
            <FormControl>
              <label
                style={{
                  fontSize: "12px",
                }}
              >
                NameSpace
              </label>
              <Select
                style={{ width: "170px" }}
                labelId="namespace-select-label"
                id="namespace-select"
                value={selectedNamespace}
                onChange={handleNamespaceChange}
              >
                {/*            
           <MenuItem value="all">All</MenuItem>
           <MenuItem value="observai-main">observai-main</MenuItem>
           <MenuItem value="datamesh-space">datamesh-space</MenuItem> */}
                <MenuItem value="all">All</MenuItem>
                {/* Dynamically populate menu items based on unique namespace values */}
                {namespaceOptions.map((namespace, index) => (
                  <MenuItem key={index} value={namespace}>
                    {namespace}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ marginLeft: "10px" }}>
              {/* <InputLabel id="instrumented-select-label">Instrumented</InputLabel> */}
              <label
                style={{
                  fontSize: "12px",
                }}
              >
                Instrumented
              </label>
              <Select
                style={{ width: "170px" }}
                labelId="instrumented-select-label"
                id="instrumented-select"
                value={selectedInstrumented}
                onChange={handleInstrumentedChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Instrumented</MenuItem>
                <MenuItem value="false">Non-Instrumented</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "600px", overflowY: "auto" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "midnightblue" }}
                    >
                      Deployment Name
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "midnightblue" }}
                    >
                      Name Space
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "midnightblue" }}
                    >
                      Service Name
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "midnightblue" }}
                    >
                      Instrumented
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 &&
                    filteredData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.deploymentName}</TableCell>
                        <TableCell>{item.namespaceName}</TableCell>
                        <TableCell>{item.serviceName || "Nil"}</TableCell>

                        <TableCell>
                          {item.instrumented === "true"
                          // ||instrument==='instrumented'
                           ? (
                          
                          <Button
                              sx={{
                                backgroundColor: "green",
                                "&:hover": { backgroundColor: "green" },
                              }}
                              onClick={() =>
                                handleUnInstrument(
                                  item.deploymentName,
                                  item.namespaceName
                                )
                              }
                            >
                              Instrumented
                            </Button>
                            
                          ) : (
                            <Button
                              sx={{
                                backgroundColor: "red",
                                "&:hover": { backgroundColor: "red" },
                              }}
                              onClick={() =>
                                handleInstrument(
                                  item.deploymentName,
                                  item.namespaceName
                                )
                              }
                            >
                              Uninstrumented
                            </Button>
                          )}
                        </TableCell>
                        {/* {InstrumentLoading?(<Loading sx={{fontSize:"10px"}}/> ):(<TableCell>
                          {item.instrumented === "true" ? (
                          
                          <Button
                              sx={{
                                backgroundColor: "green",
                                "&:hover": { backgroundColor: "green" },
                              }}
                              onClick={() =>
                                handleUnInstrument(
                                  item.deploymentName,
                                  item.namespaceName
                                )
                              }
                            >
                              Instrumented
                            </Button>
                            
                          ) : (
                            <Button
                              sx={{
                                backgroundColor: "red",
                                "&:hover": { backgroundColor: "red" },
                              }}
                              onClick={() =>
                                handleInstrument(
                                  item.deploymentName,
                                  item.namespaceName
                                )
                              }
                            >
                              Uninstrumented
                            </Button>
                          )}
                        </TableCell>)} */}
                       
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
       
      ) }
      {/* : (
        <h4>Error occured</h4>
      )} */}
    </div>
  );
};

export default ClusterInfo;
