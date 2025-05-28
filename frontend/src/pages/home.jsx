import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  TextField,
  Typography,
  Box,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return; // prevent empty join
    await addToUserHistory(meetingCode.trim());
    navigate(`/${meetingCode.trim()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Nexcall
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="history"
              onClick={() => navigate("/history")}
              size={isSmallScreen ? "small" : "medium"}
            >
              <RestoreIcon />
            </IconButton>
            {!isSmallScreen && (
              <Typography
                variant="body1"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/history")}
              >
                History
              </Typography>
            )}
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              size={isSmallScreen ? "small" : "medium"}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 10 },
          py: 6,
          gap: 6,
          minHeight: "calc(100vh - 64px)", // full height minus appbar
          backgroundColor: "#f9fafb",
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "50%" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Providing Quality Video Call and Chat Experience
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinVideoCall();
            }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: 3,
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "center",
            }}
          >
            <TextField
              label="Meeting Code"
              variant="outlined"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              size="medium"
              required
              sx={{ flexGrow: 1, minWidth: "200px" }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: { xs: "100%", sm: "120px" } }}
            >
              Join
            </Button>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "50%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/logo3.png"
            alt="Nexcall Logo"
            sx={{
              maxWidth: "300px",
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default withAuth(HomeComponent);
