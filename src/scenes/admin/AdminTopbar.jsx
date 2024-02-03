import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import logo from "../../assets/zaga-logedit.jpg";

const AdminTopbar = () => {
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
    </div>
  );
};

export default AdminTopbar;
