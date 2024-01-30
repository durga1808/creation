import React, { useContext, useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/zaga-logedit.jpg";
import { GlobalContext } from "../../global/globalContext/GlobalContext";

const CllusterDashboard = () => {
  const navigate = useNavigate();
  const { ClusterActiveTab, setClusterActiveTab } = useContext(GlobalContext);
  const [tabValue, setTabValue] = useState(0);

  console.log("ClusterActiveTab", ClusterActiveTab);

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/admin/clusterDashboard");
    } else if (newValue === 1) {
      navigate("/admin/clusterDashboard/rulesInfo");
    }
    setClusterActiveTab(newValue);
  };

  useEffect(() => {
    if (window.location.pathname === "/admin/clusterDashboard") {
      setClusterActiveTab(0);
    } else if (
      window.location.pathname === "/admin/clusterDashboard/rulesInfo"
    ) {
      setClusterActiveTab(1);
    }
  }, [handleTabChange]);

 
  return (
    <div>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50px",

            backgroundColor: "#00888C",
          }}
        >
          <Box style={{ margin: "15px 20px 10px 0px", display: "flex" }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "60px",
                height: "27px",
                marginRight: "20px",
              }}
            />
            <Typography
              sx={{
                color: "#FFF",
                borderLeft: "4px solid white",
                paddingLeft: "20px",
                fontWeight: "bold",
              }}
              variant="h3"
              fontWeight="500"
              marginLeft={1}
            >
              Cluster Management
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <AppBar position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#00888C",
            minHeight: "55px",
            borderTop: "1px solid  white",
          }}
        >
          <div>
            <Tabs value={ClusterActiveTab} onChange={handleTabChange}>
              <Tab label="Services" sx={{ color: "#FFF" }} />
              <Tab label="Rules" sx={{ color: "#FFF" }} />
            </Tabs>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default CllusterDashboard;
