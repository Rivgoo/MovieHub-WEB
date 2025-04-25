import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";
import Footer from "../../shared/components/Footer";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { PrimaryButton } from "../../shared/components/Buttons";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
  <>
    <Container 
      
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        justifyContent: "center",
        background: "background.default",
        }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          MovieHub
        </Typography>

        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Welcome!
        </Typography>

        <Divider sx={{ width: "80%", mb: 1 }} />

        {user ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 1 }}>
              Logged in as:
            </Typography>
            <Typography
              color="text.secondary"
              variant="body1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              ID: {user.id}
            </Typography>
            <Typography
              color="text.secondary"
              variant="body1"
              sx={{ fontStyle: "italic", mb: 3 }}
            >
              Role: {user.role}
            </Typography>
            <PrimaryButton
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ width: "50%" }}
            >
              Logout
            </PrimaryButton>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 2 }}>
              Please login to continue.
            </Typography>
            <PrimaryButton
              onClick={handleLogin}
              sx={{ width: "50%" }}
            >
              Login
            </PrimaryButton>
          </Box>
        )}
      </Paper>
    </Container>
    <Footer />
  </>
  );
};

export default HomePage;
