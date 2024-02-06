import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { getAllRules } from "../../api/LoginApiService";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import Loading from "../../global/Loading/Loading";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import RuleDetailsPopup from "./RulesDetailsPopup";

function createData(serviceName, rules) {
  return {
    serviceName,
    rules,
  };
}

const rows = [
  createData("order-srv-1", [
    {
      ruleType: "trace",
      startDateTime: "2024-01-10T10:30:00",
      expiryDateTime: "2024-01-30T17:00:00",
      duration: 200,
      durationConstraint: "greaterThan",
      memoryLimit: 0,
      memoryConstraint: "",
      cpuLimit: 0,
      cpuConstraint: "",
      severityText: [""],
      severityConstraint: "",
    },
    {
      ruleType: "metric",
      startDateTime: "2024-01-07T10:30:00",
      expiryDateTime: "2024-01-31T17:00:00",
      duration: 0,
      durationConstraint: "",
      memoryLimit: 1300,
      memoryConstraint: "",
      cpuLimit: 1e-7,
      cpuConstraint: "greaterThan",
      severityText: [""],
      severityConstraint: "",
    },
  ]),
  createData("vendor-srv-1", [
    {
      ruleType: "trace",
      startDateTime: "2024-01-01",
      expiryDateTime: "2024-01-05",
      duration: 0,
      durationConstraint: "",
      memoryLimit: 0,
      memoryConstraint: "",
      cpuLimit: 0,
      cpuConstraint: "",
      severityText: [""],
      severityConstraint: "",
    },
  ]),
];

const RulesDetails = ({ row}) => {
  const navigate = useNavigate();
  const { serviceListData, setServiceListData } = useContext(GlobalContext)
  const [rows, setRows] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedRule, setSelectedRule] = useState(null);
  const [open, setOpen] = useState(false);

  console.log("rules----------", rows)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const payload = {
    username: userInfo.username,
    password: userInfo.password,
    roles: userInfo.roles,
  };

  useEffect(() => {
    const handleGetAllRules = async () => {
      try {
        setLoading(true)
        const data = await getAllRules(payload);
        const rowsData = data.map((item) =>
          createData(item.serviceName, item.rules)
        );
        setRows(rowsData);
        setLoading(false);
        setServiceListData(data)
        console.log("Rules Lists:", data);
      } catch (error) {
        console.error("Error fetching rules:", error);
        setErrorMessage("Error in Displaying Rules")
        setLoading(false)
      }
    };
    handleGetAllRules();
  }, []);

  const handleAddRules = () => {
    navigate("/admin/addRules");
  };

  const handleOpenPopup = (rule) => {
    setSelectedRule(rule);
    setOpen(true);
  };

  return (
    <div style={{ marginTop: "0px" }}>
      {loading ? (
        <Loading />
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
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRules}
              sx={{
                marginTop: "15px",
                height: "35px",
                fontWeight: "bold",
                backgroundColor: "lightgray",
                marginRight: "20px",
                "&:hover": { backgroundColor: "lightgray" },
              }}
            >
              Add Rule
            </Button>
          </div>

          <TableContainer component={Paper} sx={{ maxHeight: "500px", marginTop:"10px", overflowY: "auto" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Rule Type
                  </TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Service Name
                  </TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Start Date
                  </TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Expiry Date
                  </TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) =>
                  row.rules && row.rules.map((rule, index) => (
                    <TableRow key={index}>
                      <TableCell>{rule.ruleType}</TableCell>
                      <TableCell>{row.serviceName}</TableCell>
                      <TableCell>{rule.startDateTime}</TableCell>
                      <TableCell>{rule.expiryDateTime}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenPopup(rule)}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                      {selectedRule && (
                        <RuleDetailsPopup rule={selectedRule} 
                        // serviceName={row.serviceName}
                            serviceName={rows.find(row => row.rules && row.rules.some(r => r === selectedRule))?.serviceName || '-'} 

                         handleOpenPopup={handleOpenPopup} />
                      )}
              </TableBody>

            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default RulesDetails;
