import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

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
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        justifyContent: "center",
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
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ width: "50%" }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 2 }}>
              Please login to continue.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ width: "50%" }}
            >
              Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;
