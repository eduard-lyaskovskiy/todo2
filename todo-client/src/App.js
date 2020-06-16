import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
//AXIOS
import axios from "axios";
//decode library
import jwtDecode from "jwt-decode";
//MUI stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";
//components and utils
import Navbar from "./components/layout/Navbar";
import AuthRoute from "./util/AuthRoute";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://europe-west3-todos2-3506e.cloudfunctions.net/api";
// Check Authorization
const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 10000 < Date.now()) {
        store.dispatch(logoutUser());
        store.dispatch({ type: SET_UNAUTHENTICATED });
        axios.defaults.headers.common["Authorization"] = "";
        window.location.assign("/login");
    } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
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
                            <AuthRoute exact path="/login" component={Login}></AuthRoute>
                            <AuthRoute exact path="/signup" component={Signup}></AuthRoute>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
