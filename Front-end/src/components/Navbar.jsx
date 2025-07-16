import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";


import { isAuthenticated, getUserNameFromToken, logout } from "../Util/auth";
import { isAdminAuthenticated, getAdminUserNameFromToken, adminLogout } from "../Util/adminAuth.js";

import Modal from "@mui/material/Modal";
import Login from "./login.jsx";
import Register from "./Register.jsx";

// Navbar component 

function Navbar() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const isLoggedIn = isAuthenticated();
    const userName = getUserNameFromToken();

    const isAdminLoggedIn = isAdminAuthenticated()
    const adminName = getAdminUserNameFromToken()

    const handleLoginOpen = () => setLoginOpen(true);
    const handleLoginClose = () => setLoginOpen(false);
    const handleRegisterOpen = () => setRegisterOpen(true);
    const handleRegisterClose = () => setRegisterOpen(false);

    return (
        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                color: "#222",
                top: 20,
                left: "10%",
                right: "10%",
                width: "80%",
                borderRadius: 2,
                zIndex: 1201,
            }}
        >
            <Toolbar>
                {/* Left: Logo/Title */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", flex: 1, color: "#1976d2", cursor:'pointer' }}
                    onClick={()=>{window.location.href = "/"}}
                >
                    Student Events Hub
                </Typography>


                {
                    isAdminLoggedIn ? (
                        <>
                        <Button
                            color="error"
                            sx={{ fontWeight: "bold", mr: 1 }}
                            onClick={() => adminLogout()}
                        >
                            Logout
                        </Button>
                        <Button
                                onClick={() => window.location.href = "/admin/home"}
                                startIcon={<AccountCircleIcon />}
                                color="primary"
                                sx={{ fontWeight: "bold", textTransform: "none" }}
                            >   ADMIN - {adminName}
                            </Button>
                        </>
                    ): (
                            <Box sx = {{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                {isLoggedIn ? (
                    <>
                        <Button
                            color="error"
                            sx={{ fontWeight: "bold", mr: 1 }}
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                        <Button
                            startIcon={<AccountCircleIcon />}
                            color="primary"
                            sx={{ fontWeight: "bold", textTransform: "none" }}
                        >
                            {userName}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="primary" sx={{ fontWeight: "bold", mr: 1 }} onClick={handleLoginOpen}>
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                            onClick={handleRegisterOpen}
                        >
                            Register
                        </Button>
                        <Modal
                            open={loginOpen}
                            onClose={handleLoginClose}
                            sx={{
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'transparent',

                                borderRadius: 2,
                                p: 0,
                                outline: 'none',
                                width: { xs: '90vw', sm: '50vw', md: '30vw' },
                                height: "max-content",

                            }}>
                                <Login />
                            </Box>
                        </Modal>

                        <Modal
                            open={registerOpen}
                            onClose={handleRegisterClose}
                            sx={{
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'transparent',

                                borderRadius: 2,
                                p: 0,
                                outline: 'none',
                                width: { xs: '90vw', sm: '50vw', md: '30vw' },
                                height: "max-content",
                            }}>
                                <Register />
                            </Box>
                        </Modal>
                    </>
                )}
            </Box>
            )
                }




        </Toolbar>
        </AppBar >
    );
}

export default Navbar;