import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { updateServiceList } from "../../api/LoginApiService";

const RuleDetailsPopup = ({ rule, onClose, serviceName }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRules, setEditedRules] = useState({...rule});

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        setOpen(true);
    }, [rule]);

    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
        if (onClose) {
          onClose();
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    
    const handleSaveClick = async() => {
        try {
            const updatedRule = {
                serviceName: serviceName,
                roles: userInfo.roles,
                rules: [editedRules]
            }
            await updateServiceList(updatedRule);
            handleClose();
            setIsEditing(false);
          } catch (error) {
            console.error("Error updating rule:", error);
          }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        let newValue;
        if (name === 'severityText') {
            newValue = value.split(',');
            newValue = newValue.map(text => text.trim().toUpperCase());
            // newValue = value.split(',').map(text => text.trim().toUpperCase());
        } else {
            newValue = value;
        }
        setEditedRules(prevState => ({
            ...prevState,
            [name]: newValue,
        }));
    };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Rule Details - ${serviceName} - ${rule.ruleType}`}</DialogTitle>
      <DialogContent>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Rule Type</TableCell>
                <TableCell>{rule.ruleType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>{serviceName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>
                    {isEditing ? (
                        <TextField
                        name="startDateTime"
                        value={editedRules.startDateTime}
                        onChange={handleFieldChange}
                        />
                    ) : (
                        rule.startDateTime
                    )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Expiry Date</TableCell>
                <TableCell>
                    {isEditing ? (
                        <TextField
                            name="expiryDateTime"
                            value={editedRules.expiryDateTime}
                            onChange={handleFieldChange}
                        />
                    ) : (
                        rule.expiryDateTime
                    )}
                </TableCell>
              </TableRow>

              {rule.ruleType === "trace" && (
                <>
                  <TableRow>
                    <TableCell>Duration</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="duration"
                                value={editedRules.duration}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            rule.duration
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Duration Constraint</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="durationConstraint"
                                value={editedRules.durationConstraint}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            rule.durationConstraint
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trace Alert Severity</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="tracecAlertSeverityText"
                                value={editedRules.tracecAlertSeverityText}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            rule.tracecAlertSeverityText
                        )}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {rule.ruleType === "metric" && (
                <>
                  <TableRow>
                    <TableCell>Memory Limit</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="memoryLimit"
                                value={editedRules.memoryLimit}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            rule.memoryLimit
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Memory Constraint</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="memoryConstraint"
                          value={editedRules.memoryConstraint}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        rule.memoryConstraint
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Memory Alert Severity</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="memoryAlertSeverityText"
                          value={editedRules.memoryAlertSeverityText}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        rule.memoryAlertSeverityText
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Limit</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="cpuLimit"
                          value={editedRules.cpuLimit}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        rule.cpuLimit
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Constraint</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="cpuConstraint"
                          value={editedRules.cpuConstraint}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        rule.cpuConstraint
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPU Alert Severity</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="cpuAlertSeverityText"
                          value={editedRules.cpuAlertSeverityText}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        rule.cpuAlertSeverityText
                      )}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {rule.ruleType === "log" && (
                <>
                  <TableRow>
                    <TableCell>Severity Text</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="severityText"
                                value={editedRules.severityText}
                                onChange={handleFieldChange}
                            />
                        ) : (
                          rule.severityText.join(', ') 
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Severity Constraint</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="severityConstraint"
                                value={editedRules.severityConstraint}
                                onChange={handleFieldChange}
                            />
                        ) : (
                          rule.severityConstraint
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Log Alert Severity</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <TextField
                                name="logAlertSeverityText"
                                value={editedRules.logAlertSeverityText}
                                onChange={handleFieldChange}
                            />
                        ) : (
                          rule.logAlertSeverityText
                        )}
                    </TableCell>
                  </TableRow>
                </>
              )}

            </TableBody>
          </Table>
        </TableContainer>

      </DialogContent>
      <DialogActions>
      {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        )}

        <Button variant="contained" color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleDetailsPopup;
