import React, { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  styled,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getAllRules, updateServiceList } from "../../api/LoginApiService";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

function createData(serviceName, rules) {
  return {
    serviceName,
    rules,
  };
}

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedRules, setEditedRules] = useState(row.rules);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StyledTableCell = styled(TableCell)(() => ({
    borderBottom: "none",
  }));

  const handleEdit = () => {
    setEditable(true);
    setOpen(!open);
  };

  const handleInputChange = (index, property, value) => {
    const updatedRules = [...editedRules];
    if (property === "severityText") {
      updatedRules[index] = {
        ...updatedRules[index],
        [property]: [value],
      };
    } else {
      updatedRules[index] = { ...updatedRules[index], [property]: value };
    }
    setEditedRules(updatedRules);
    setEditable(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedServiceRules = {
        serviceName: row.serviceName,
        rules: editedRules,
      };
      const response = await updateServiceList(updatedServiceRules);
      console.log("Updated Rules:", editedRules);

      console.log("Request Payload:", updatedServiceRules);
      console.log("Server Response:", response);

      console.log("Rules updated successfully", response);
      setEditable(false);
    } catch (error) {
      console.error("Error updating rules:", error);
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="h6">{row.serviceName}</Typography>
        </TableCell>

        <TableCell>
          {editable ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Save
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h4">Rules</Typography>

              {editedRules && editedRules.length > 0 ? (
                <Grid container spacing={2}>
                  {editedRules.map((rule, index) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                      {/* <div key={index}> */}
                      <br />
                      <>
                        <TableRow>
                          <StyledTableCell>Rule Type:</StyledTableCell>
                          <StyledTableCell>{rule.ruleType}</StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell>Start Date:</StyledTableCell>
                          {editable ? (
                            <TextField
                              sx={{ padding: "10px" }}
                              value={rule.startDateTime}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "startDateTime",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <StyledTableCell>
                              {rule.startDateTime}
                            </StyledTableCell>
                          )}
                        </TableRow>

                        <TableRow>
                          <StyledTableCell>Expiry Date:</StyledTableCell>
                          {editable ? (
                            <TextField
                              sx={{ padding: "10px" }}
                              value={rule.expiryDateTime}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "expiryDateTime",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <StyledTableCell>
                              {rule.expiryDateTime}
                            </StyledTableCell>
                          )}
                        </TableRow>
                      </>

                      {rule.ruleType === "trace" && (
                        <>
                          <TableRow>
                            <StyledTableCell>Duration:</StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.duration}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>{rule.duration}</StyledTableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>
                              Duration Constraint:
                            </StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.durationConstraint}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "durationConstraint",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.durationConstraint}{" "}
                              </StyledTableCell>
                            )}
                          </TableRow>
                        </>
                      )}

                      {rule.ruleType === "metric" && (
                        <>
                          <TableRow>
                            <StyledTableCell>Memory Limit:</StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.memoryLimit}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "memoryLimit",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.memoryLimit}
                              </StyledTableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>
                              Memory Constraint:
                            </StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.memoryConstraint}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "memoryConstraint",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.memoryConstraint}
                              </StyledTableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>CPU Limit:</StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.cpuLimit}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "cpuLimit",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>{rule.cpuLimit}</StyledTableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>CPU Constraint:</StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.cpuConstraint}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "cpuConstraint",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.cpuConstraint}
                              </StyledTableCell>
                            )}
                          </TableRow>
                        </>
                      )}

                      {rule.ruleType === "log" && (
                        <>
                          <TableRow>
                            <StyledTableCell>Severity Text:</StyledTableCell>
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.severityText}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "severityText",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.severityText}
                              </StyledTableCell>
                            )}
                          </TableRow>

                          <TableRow>
                            <StyledTableCell>
                              Severity Constraint:
                            </StyledTableCell>
                            {/* {rule.severityConstraint} */}
                            {editable ? (
                              <TextField
                                sx={{ padding: "10px" }}
                                value={rule.severityConstraint}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "severityConstraint",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <StyledTableCell>
                                {rule.severityConstraint}
                              </StyledTableCell>
                            )}
                          </TableRow>
                        </>
                      )}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h6">
                  No rules available for this service.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     serviceName: PropTypes.string.isRequired,
//     rules: PropTypes.arrayOf(
//       PropTypes.shape({
//         ruleType: PropTypes.string.isRequired,
//         startDateTime: PropTypes.string.isRequired,
//         expiryDateTime: PropTypes.string.isRequired,
//         duration: PropTypes.number,
//         durationConstraint: PropTypes.string,
//         memoryLimit: PropTypes.number,
//         memoryConstraint: PropTypes.string,
//         cpuLimit: PropTypes.number,
//         cpuConstraint: PropTypes.string,
//         severityText: PropTypes.arrayOf(PropTypes.string),
//         severityConstraint: PropTypes.string,
//       })
//     ).isRequired,
//   }).isRequired,
// };

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

const RulesDetails = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const payload = {
    username: userInfo.username,
    password: userInfo.password,
    roles: userInfo.roles,
  };

  useEffect(() => {
    const handleGetAllRules = async () => {
      try {
        const data = await getAllRules(payload);
        const rowsData = data.map((item) =>
          createData(item.serviceName, item.rules)
        );
        setRows(rowsData);
        console.log("Rules Lists:", data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    };
    handleGetAllRules();
  }, []);

  const handleAddRules = () => {
    navigate("/admin/addRules");
  };

  return (
    <div style={{ marginTop: "0px" }}>
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

      <TableContainer component={Paper} sx={{marginTop:"10px"}}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", backgroundColor: "#00888C" }} />
              <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                Service Name
              </TableCell>
              <TableCell sx={{ color: "white", backgroundColor: "#00888C" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.serviceName} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RulesDetails;
