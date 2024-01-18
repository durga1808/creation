import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography,
  } from "@mui/material";
  import Box from "@mui/material/Box";
  import React, { useEffect, useState } from "react";
  import Observai from "../assets/observai.png";
  import Infra from "../assets/Infra.jpeg";
  import Sustainability from "../assets/sustainability.jpeg";
  import Admin from "../assets/admin.jpeg";
  import ZagaLogo from "../assets/zaga-logedit.jpg";
  import LoginIcon from "@mui/icons-material/Login";
  import { useNavigate } from "react-router-dom";
  
  const LandingPage = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);

    console.log("authenticated", authenticated);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("userInfo", userInfo);
    
  
    useEffect(() => {
      // Check if the user is authenticated
      const userDetails = localStorage.getItem("userInfo");
  
      if (userDetails) {
        const admin = JSON.parse(userDetails);
        const admincheck = admin.roles && admin.roles.includes("admin");
  
        // Set the authenticated state based on the user's role
        setAuthenticated(admincheck);
      }
    }, []);
  
    const handlelogin = () => {
      navigate("/login");
    };
  
    const handleobservability = () => {
      navigate(authenticated ? "/mainpage/dashboard" : "/notAuth");
    };
  
    const handleInfra = () => {
      navigate(authenticated ? "/mainpage/apm" : "/notAuth");
    }

    const handleAdminPage = () => {
      navigate(authenticated ? "/admin" : "/notAuth");
    }

  

  // const handleInfra = () => {
  //     if (authenticated) {
  //       // Check if the user has the 'vendor' role
  //       const userDetails = JSON.parse(localStorage.getItem("userInfo"));
  //       const isVendor = userDetails && userDetails.roles.includes("admin");

  //       if (isVendor) {
  //         // If the user is a vendor, navigate to the Infra page
  //         navigate("/mainpage/apm");
  //       } else {
  //         // If the user is not a vendor, you can show an error message or handle it accordingly
  //         console.error("Unauthorized access: Vendor access only.");
  //       }
  //     } else {
  //       // If the user is not authenticated, navigate to the login page
  //       navigate("/login");
  //     }
  //   };

  return (
    <div style={{ margin: "30px", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "110px",
        }}
      >
        {/* Zaha Logo */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            sx={{
              height: 60,
              width: 200,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
            }}
            // alt="The house from the offer."
            src={ZagaLogo}
          />
        </div>

        {/* Login Icon */}
        <div
        style={{ marginLeft: "10px" }}>
          <IconButton onClick={handlelogin}>
            <LoginIcon />
          </IconButton>
        </div>
        </div>
  
        <Box
          sx={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={6}
            justifyContent="center"
            textAlign="center"
            alignItems="center"
          >
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Observai}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Observability - APM
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand the
                      internal state or condition of a complex system based only
                      on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="info"
                      onClick={handleobservability}
                    >
                      Open Observability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Infra}
                    title="observability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Observability - Infra
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Observability is the extent to which you can understand the
                      internal state or condition of a complex system based only
                      on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                     size="small" 
                     color="info" 
                     onClick={handleInfra}
                    >
                      Open Observability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={Sustainability}
                    title="Sustainability"
                  />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Sustainability
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Sustainability has become a priority in all aspects of a
                      business, and to manage energy efficiency. IT ops teams must
                      look closely at where and what is using the most energy and
                      one major offender is Kubernetes clusters.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info">
                      Open Sustainability
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
  
            <Grid item xs={8} sm={2.6} ipadmini={4}>
              <Grid container justifyContent="center">
                <Card elevation={3}>
                  <CardMedia sx={{ height: 140 }} image={Admin} title="Admin" />
                  <CardContent sx={{ height: "168px" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Admin
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "justify",
                        fontWeight: "light",
                        paddingTop: "10px",
                      }}
                    >
                      Identify the specific rules and policies you want to enforce
                      within your clusters. Implement specific rules and policies
                      within clusters to govern resource allocation. Creating and
                      modifying clusters while enforcing rules.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info" onClick={handleAdminPage}>
                      Open Admin Dashboard
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  };
  
  export default LandingPage;
  