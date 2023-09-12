import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  AnalyticsOutlined,
  DashboardOutlined,
  MenuOutlined,
  TimelineOutlined,
  ReceiptOutlined,
  Person,
} from "@mui/icons-material";
import { useContext } from "react";
import { tokens } from "../theme";
import { Link } from "react-router-dom";
import { GlobalContext } from "./globalContext/GlobalContext";

const SideNavbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === 'dark';

  const routeChange = (routeName) => {
    localStorage.setItem("routeName", routeName);
  };

  const { isCollapsed, setIsCollapsed } = useContext(GlobalContext);
  const { selected, setSelected } = useContext(GlobalContext);

  return (
    <Box className="sideclose" >
      {/* <ProSidebar collapsed={collapsed}> */}
      <Sidebar collapsed={isCollapsed} rootStyles={{ height: "100vh",borderRight: "none",  }} >
        <Menu iconShape="square" rootStyles={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: colors.primary[400],  }} menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0) {
              return {
                color: active ? colors.lightGreen[500] : colors.primary[100],
                fontWeight: active ? "bold" : "normal",
                // backgroundColor: active ? "#000" : "#fff",
                "&:hover": {
                  backgroundColor: "#335B8C !important",
                  color: "white !important",
                  borderRadius: "8px !important",
                  fontWeight: "bold !important",
                },
              };
            }
          },
        }} >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="1px"
            >
              <Typography
                variant="h6"
                fontWeight="500"
                marginRight={1}
              >
                OBSERVABILITY
              </Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuOutlined /> : undefined} >
                <MenuOutlined />
              </IconButton>
            </Box>
          </MenuItem>

          <MenuItem
            component={<Link to="/mainpage/dashboard" />}
            active={selected === "Dashboard"}
            icon={<DashboardOutlined />}
            onClick={() => {setSelected("Dashboard"); routeChange("Dashboard");}}
          >
            <Typography variant="h7">DASHBOARD</Typography>
          </MenuItem>

          <Typography variant="h7" sx={{ m: "15px 10px 10px 20px" }}>
            Data
          </Typography>

          <MenuItem component={<Link to="/mainpage/traces" />} active={selected === "Traces"} icon={<TimelineOutlined />} onClick={() => {setSelected("Traces"); routeChange("Traces");}}  >
            <Typography variant="h7">TRACES</Typography>
          </MenuItem>

          <MenuItem component={<Link to="/mainpage/metrics" />} active={selected === "Metrics" } icon={<AnalyticsOutlined />} onClick={() => {setSelected("Metrics"); routeChange("Metrics");}}  >
            <Typography variant="h7">METRICS</Typography>
          </MenuItem>

          <MenuItem component={<Link to="/mainpage/logs" />} active={selected === "Logs" } icon={<ReceiptOutlined />} onClick={() => {setSelected("Logs"); routeChange("Logs");}}  >
            <Typography variant="h7">LOGS</Typography>
          </MenuItem>

          <MenuItem icon={<Person />} rootStyles={{ position: "absolute", bottom: "2%", width: "100%" }}  >
            <Typography variant="h7">LoggedIn User</Typography>
            <br />
            <Typography variant="h7">Role</Typography>
          </MenuItem>

        </Menu>
        {/* </ProSidebar> */}
      </Sidebar>
    </Box>
  );
};

export default SideNavbar;