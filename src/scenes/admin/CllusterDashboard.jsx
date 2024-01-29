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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CllusterDashboard = () => {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/admin/clusterDashboard");
    } else if (newValue === 1) {
      navigate("/admin/clusterDashboard/rulesInfo");
    }
    setTabValue(newValue);
  };
  return (
    <div>
      {" "}
      <AppBar position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "midnightblue",
            minHeight: "65px",
          }}
        >
          <div>
            <Tabs value={tabValue} onChange={handleTabChange}>
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
