import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
//MUI stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
//components
import Navbar from "./components/Navbar";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#00bc24",
            main: "#33c9dc",
            dark: "#008394",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff6333",
            main: "#ff3d00",
            dark: "#b22a00",
            contrastText: "#fff",
        },
        typography: {
            useNextVariants: true,
        },
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <BrowserRouter>
                    <Navbar></Navbar>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home}></Route>
                            <Route exact path="/login" component={Login}></Route>
                            <Route exact path="/signup" component={Signup}></Route>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
