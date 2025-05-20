import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { Observer } from "mobx-react-lite";
import { useStore } from "../../lib/hooks/useStore";
import { useAccount } from "../../lib/hooks/useAccount";
import { UserMenu } from "./UserMenu";
export default function NavBar() {
  const { currentUser } = useAccount();
  const { UIStore } = useStore(); // Create an instance of UIStore
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundImage:
            "linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MenuItem
                component={NavLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "uppercase",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  style={{ width: "50px", height: "50px", marginRight: "1rem" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  style={{ color: "#fff", position : "relative" }}
                >
                  Reactivities
                </Typography>
                <Observer>
                  {() =>
                    UIStore.isLoading ? (
                      <CircularProgress
                      size={20}
                      thickness={7}
                        sx={{
                         color : "#fff",
                         position : "absolute",
                         top: '30%',
                         left: '105%'
                        }}
                        color="secondary"
                      />
                    ) : null
                  }
                </Observer>
              </MenuItem>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MenuItemLink to="/activities">
                <Typography fontWeight="bold" style={{ color: "#fff" }}>
                  Activities
                </Typography>
              </MenuItemLink>
              <MenuItemLink to="/counter">
                <Typography fontWeight="bold" style={{ color: "#fff" }}>
                  Counter
                </Typography>
              </MenuItemLink>
              <MenuItemLink to="/errors">
                <Typography fontWeight="bold" style={{ color: "#fff" }}>
                  Errors
                </Typography>
              </MenuItemLink>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              {currentUser ? (
                <UserMenu />
              ) : (
                <>
                  <MenuItemLink to="/login">
                    <Typography fontWeight="bold" style={{ color: "#fff" }}>
                      Login
                    </Typography>
                  </MenuItemLink>
                  <MenuItemLink to="/register">
                    <Typography fontWeight="bold" style={{ color: "#fff" }}>
                      Register
                    </Typography>
                  </MenuItemLink>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
