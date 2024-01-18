import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { getClusterDetails, loginUser, updateClusterDetails } from "../../api/LoginApiService";
import { useNavigate } from "react-router-dom";

const AdminTopBar = () => {
  const navigate = useNavigate();
  const [ClusterData, setClusterData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPassword,setEditedPassword] = useState('');
  const [editedClusterType, setEditedClusterType] = useState("");
  const [editedHostURL, setEditedHostURL] = useState("");

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userInfo"));
    const payload = {
      username: userDetails.username,
      password: userDetails.password,
    };
    const fetchData = async () => {
      try {
        // Your asynchronous logic goes here
        const response = await loginUser(payload);

        // Do something with the fetched data
        // console.log("clusterData adminPage", response.data.environments);
        setClusterData(response.data.environments);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function immediately
    fetchData();
  }, [editableRowId]);

  const handleAddCluster = () => {
    navigate("addCluster");
  };

  const handleAddRules = () => {
    navigate("addRules")
  }

  const handleEditRow = (
    rowId,
    currentUserName,
    currentclusterPassword,
    currentClusterType,
    currentHostURL
  ) => {
    setEditableRowId(rowId);
    setEditedUserName(currentUserName);
    setEditedPassword(currentclusterPassword);
    setEditedClusterType(currentClusterType);
    setEditedHostURL(currentHostURL);
  };

  const handleSaveRow = async() => {
    // Implement logic to save the edited row data
    const userDetails =JSON.parse(localStorage.getItem("userInfo")) ;

    const updatedClusterPayload=   {
      username:userDetails.username,
      password:userDetails.password,
      roles:userDetails.roles,
      environments: [
        {
          clusterId:editableRowId,
          clusterUsername: editedUserName,
          clusterPassword: editedPassword,
          hostUrl: editedHostURL,
          clusterType: editedClusterType
        }
      ]
    }

    console.log("edited Row Details",updatedClusterPayload);
    await updateClusterDetails(updatedClusterPayload);
    setEditableRowId(null);
  };

  const data = {
    username: "mariselvam",
    password: "Selvam@3799",
  };

  // 091365

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "midnightblue" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}
          >
            Cluster
          </Typography>
          <Button
            onClick={handleAddRules}
            sx={{
              backgroundColor: "gray",
              marginRight: "20px",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            Add Rule
          </Button>
          <Button
            onClick={handleAddCluster}
            sx={{
              backgroundColor: "gray",
              marginRight: "20px",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            Add Cluster
          </Button>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "midnightblue" }}>
            <TableRow>
              <TableCell align="center" sx={{ color: "white" }}>
                User Name
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                Password
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                Cluster Type
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                Host URL
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ClusterData.map((row, index) => (
              <TableRow key={row.clusterId}>
                <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                    />
                  ) : (
                    row.clusterUsername
                  )}
                </TableCell>
                 <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      type="text"
                      value={editedPassword}
                      onChange={(e) => setEditedPassword(e.target.value)}
                    />
                  ) : (
                    '*'.repeat(row.clusterPassword.length)
                  )}
                </TableCell>


                <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      value={editedClusterType}
                      onChange={(e) => setEditedClusterType(e.target.value)}
                    />
                  ) : (
                    row.clusterType
                  )}
                </TableCell>
                <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <TextField
                      value={editedHostURL}
                      onChange={(e) => setEditedHostURL(e.target.value)}
                    />
                  ) : (
                    row.hostUrl
                  )}
                </TableCell>
                <TableCell align="center">
                  {editableRowId === row.clusterId ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveRow}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleEditRow(
                          row.clusterId,
                          row.clusterUsername,
                          row.clusterPassword,
                          row.clusterType,
                          row.hostUrl
                        )
                      }
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminTopBar;
