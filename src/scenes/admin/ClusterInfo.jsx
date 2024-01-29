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
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  changeToInstrument,
  changeToUninstrument,
  getClusterListAllProjects,
} from "../../api/ClusterApiService";
import Loading from "../../global/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const ClusterInfo = () => {
  const navigate = useNavigate();
  const [data2, setData] = useState([]);
  const [namespaceOptions, setNamespaceOptions] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("all");
  const [selectedInstrumented, setSelectedInstrumented] = useState("all");
  const [loading, setLoading] = useState(false);
  const [InstrumentLoading, setInstrumentLoadig] = useState(false);
  const [changeInstrument, setChangeInstrument] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");


  useEffect(() => {
    ServiceListsApiCall();
  }, []);

  
  const ServiceListsApiCall = useCallback(async () => {
    console.log("ServiceListsApiCall Called");
    try {
      setLoading(true);
      var response = await getClusterListAllProjects();
      if (response.length !== 0) {
        setData(response);
        const uniqueNamespaces = [
          ...new Set(response.map((item) => item.namespaceName)),
        ];
        setNamespaceOptions(uniqueNamespaces);
      } else {
        setEmptyMessage("No Data to show");
      }

      setLoading(false);
    } catch (error) {
      setErrorMessage("An error Occurred!");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
    console.log("ServiceListsApiCall Ended");
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
    const instrumentresponse = await changeToInstrument(
      namespace,
      deploymentName
    );

    if (instrumentresponse.status === 200) {
      ServiceListsApiCall();
      setChangeInstrument(!changeInstrument);
      alert("Instrumentation in Progress: Please wait for a few minutes !!!");
    } else {
      alert(
        "Instrumentation Error: Something went wrong with the instrumentation."
      );
    }
  };

  const handleUnInstrument = async (deploymentName, namespace) => {
    const instrumentresponse = await changeToUninstrument(
      namespace,
      deploymentName
    );
    if (instrumentresponse.status === 200) {
      ServiceListsApiCall();
      setChangeInstrument(!changeInstrument);
      alert("Uninstrumentation in Progress: Please wait for a few minutes !!!");
    } else {
      alert(
        "Uninstrumentation Error: Something went wrong with the Uninstrumentation."
      );
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : emptyMessage ? (
        <div
          className="empty-message"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "73vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {emptyMessage}
          </Typography>
        </div>
      ) : errorMessage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "80vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <FormControl>
              <label
                style={{
                  fontSize: "12px",
                  color: "#FFF",
                }}
              >
                NameSpace
              </label>
              <Select
                style={{
                  width: "170px",
                  backgroundColor: "#FFF",
                  height: "40px",
                  marginBottom: "10px",
                }}
                labelId="namespace-select-label"
                id="namespace-select"
                value={selectedNamespace}
                onChange={handleNamespaceChange}
              >
                <MenuItem value="all">All</MenuItem>

                {namespaceOptions.map((namespace, index) => (
                  <MenuItem key={index} value={namespace}>
                    {namespace}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ marginLeft: "10px" }}>
              <label
                style={{
                  fontSize: "12px",
                  color: "#FFF",
                }}
              >
                Instrumented
              </label>
              <Select
                style={{
                  width: "170px",
                  backgroundColor: "#FFF",
                  height: "40px",
                  marginBottom: "10px",
                  marginRight: "15px",
                }}
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
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClusterInfo;
