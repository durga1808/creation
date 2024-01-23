import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getAllRules } from '../../api/LoginApiService';

function createData(serviceName, rules) {
  return {
    serviceName,
    rules,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                <Typography variant='h6'>
                    {row.serviceName}
                </Typography>
                
            </TableCell>
            {/* <TableCell component="th" scope="row">
                {row.rules.ruleType}
            </TableCell> */}
            <TableCell>
                <Button variant="contained" color="primary" onClick={() => console.log('View Details clicked')}>
                    Edit
                </Button>
            </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                    <Typography variant="h4" component="div">
                        Rules
                    </Typography>

                    {row.rules && row.rules.length > 0 ? (
                        row.rules.map((rule, index) => (
                            <div key={index}>
                                <br />
                                <Typography variant="h5" component="div">
                                    <span style={{ fontWeight: "500" }}>Rule Type:</span> {rule.ruleType}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    <span style={{ fontWeight: "500" }}>Start Date:</span> {rule.startDateTime}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    <span style={{ fontWeight: "500" }}>Expiry Date:</span> {rule.expiryDateTime}
                                </Typography>
                                
                                {rule.ruleType === 'trace' && (
                                    <>
                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Duration:</span> {rule.duration}
                                        </Typography>

                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Duration Constraint:</span> {rule.durationConstraint}
                                        </Typography>
                                    </>
                                )}

                                {rule.ruleType === 'metric' && (
                                    <>
                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Memory Limit:</span> {rule.memoryLimit}
                                        </Typography>

                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Memory Constraint:</span> {rule.memoryConstraint}
                                        </Typography>

                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>CPU Limit:</span> {rule.cpuLimit}
                                        </Typography>

                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>CPU Constraint:</span> {rule.cpuConstraint}
                                        </Typography>
                                    </>
                                )}

                                {rule.ruleType === 'log' && (
                                    <>
                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Severity Text:</span> {rule.severityText}
                                        </Typography>

                                        <Typography variant="h5" component="div">
                                            <span style={{ fontWeight: "500" }}>Severity Constraint:</span> {rule.severityConstraint}
                                        </Typography>
                                    </>
                                )}
                            </div>
                        ))
                        ) : (
                        <Typography variant="h6" component="div">
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

Row.propTypes = {
  row: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    rules: PropTypes.arrayOf(
      PropTypes.shape({
        ruleType: PropTypes.string.isRequired,
        startDateTime: PropTypes.string.isRequired,
        expiryDateTime: PropTypes.string.isRequired,
        duration: PropTypes.number,
        durationConstraint: PropTypes.string,
        memoryLimit: PropTypes.number,
        memoryConstraint: PropTypes.string,
        cpuLimit: PropTypes.number,
        cpuConstraint: PropTypes.string,
        severityText: PropTypes.arrayOf(PropTypes.string),
        severityConstraint: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

const rows = [
    createData('order-srv-1', [
        {
            ruleType: 'trace',
            startDateTime: '2024-01-10T10:30:00',
            expiryDateTime: '2024-01-30T17:00:00',
            duration: 200,
            durationConstraint: 'greaterThan',
            memoryLimit: 0,
            memoryConstraint: '',
            cpuLimit: 0,
            cpuConstraint: '',
            severityText: [''],
            severityConstraint: ''
        },
        {
            ruleType: 'metric',
            startDateTime: '2024-01-07T10:30:00',
            expiryDateTime: '2024-01-31T17:00:00',
            duration: 0,
            durationConstraint: '',
            memoryLimit: 1300,
            memoryConstraint: '',
            cpuLimit: 1e-7,
            cpuConstraint: 'greaterThan',
            severityText: [''],
            severityConstraint: ''
        }
    ]),
    createData('vendor-srv-1', [
        {
            ruleType: 'trace',
            startDateTime: '2024-01-01',
            expiryDateTime: '2024-01-05',
            duration: 0,
            durationConstraint: '',
            memoryLimit: 0,
            memoryConstraint: '',
            cpuLimit: 0,
            cpuConstraint: '',
            severityText: [''],
            severityConstraint: ''
        }
    ])
]

const RulesDetails = () => {
  const [rows, setRows] = useState([]);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const payload = {
        username: userInfo.username,
        password: userInfo.password,
        roles: userInfo.roles
    }

    useEffect(() => {
        const handleGetAllRules = async () => {
            try {
                const data = await getAllRules(payload);
                const rowsData = data.map((item) => createData(item.serviceName, item.rules));
                setRows(rowsData);
                console.log("Rules Lists:", data)
            } catch (error) {
                console.error('Error fetching rules:', error);
            }
        }

        handleGetAllRules();
    }, [])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Service Name</TableCell>
            {/* <TableCell>Rule Type</TableCell> */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.serviceName} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RulesDetails;
