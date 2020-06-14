import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
//decode library
import jwtDecode from "jwt-decode";
//MUI stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";
//components and utils
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createMuiTheme(themeFile);

// Check Authorization
let authenticated;
const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        window.location.assign("/login");
        authenticated = false;
    } else {
        authenticated = true;
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter>
                    <Navbar></Navbar>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home}></Route>
                            <AuthRoute exact path="/login" component={Login} authenticated={authenticated}></AuthRoute>
                            <AuthRoute exact path="/signup" component={Signup} authenticated={authenticated}></AuthRoute>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
