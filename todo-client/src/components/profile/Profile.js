import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "./EditDetails";
import dayjs from "dayjs";
//Redux stuff
import { connect } from "react-redux";
import { logoutUser, upLoadImage } from "../../redux/actions/userActions";
//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import MeetingRoom from "@material-ui/icons/MeetingRoom";

const styles = (theme) => ({
    paper: {
        padding: 20,
    },
    profile: {
        "& .image-wrapper": {
            textAlign: "center",
            position: "relative",
            "& button": {
                position: "absolute",
                top: "80%",
                left: "70%",
            },
        },
        "& .profile-image": {
            width: 200,
            height: 200,
            objectFit: "cover",
            maxWidth: "100%",
            borderRadius: "50%",
        },
        "& .profile-details": {
            textAlign: "center",
            "& span, svg": {
                verticalAlign: "middle",
            },
            "& a": {
                color: theme.palette.primary.main,
            },
        },
        "& hr": {
            border: "none",
            margin: "0 0 10px 0",
        },
        "& svg.button": {
            "&:hover": {
                cursor: "pointer",
            },
        },
    },
    buttons: {
        textAlign: "center",
        "& a": {
            margin: "20px 10px",
        },
    },
});

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append("image", image, image.name);
        this.props.upLoadImage(formData);
    };
    handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput.click();
    };
    handleLogout = () => {
        this.props.logoutUser();
    };
    render() {
        const {
            classes,
            user: {
                userData: {
                    credentials: { user, createdAt, imageUrl, bio, website, location },
                },
                authenticated,
                loading,
            },
        } = this.props;
        let profileMakup = !loading ? (
            authenticated ? (
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <div className="image-wrapper">
                            <img src={imageUrl} alt="profile" className="profile-image" />
                            <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
                            <Tooltip title="Edit profile picture" placement="top">
                                <IconButton onClick={this.handleEditPicture} className="button">
                                    <EditIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <hr />
                        <div className="profile-details">
                            <MuiLink component={Link} to={`users/${user}`} color="primary" variant="h5">
                                @{user}
                            </MuiLink>
                            <hr />
                            {bio && <Typography variant="body2">{bio}</Typography>}
                            {location && (
                                <Fragment>
                                    <LocationOn color="primary" /> <span>{location}</span>
                                    <hr />
                                </Fragment>
                            )}
                            {website && (
                                <Fragment>
                                    <LinkIcon color="primary" />
                                    <a href={website} target="_blank" rel="noopener noreferrer">
                                        {" "}
                                        {website}
                                    </a>
                                    <hr />
                                </Fragment>
                            )}
                            <CalendarToday color="primary" /> <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                        </div>
                        <Tooltip title="Logout" placement="top">
                            <IconButton onClick={this.handleLogout}>
                                <MeetingRoom color="primary" />
                            </IconButton>
                        </Tooltip>
                        <EditDetails />
                    </div>
                </Paper>
            ) : (
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        No profile found
                    </Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            Login
                        </Button>
                        <Button variant="contained" color="secondary" component={Link} to="/signup">
                            Signup
                        </Button>
                    </div>
                </Paper>
            )
        ) : (
            <p>loading...</p>
        );
        return profileMakup;
    }
}

const mapActionsToProps = { logoutUser, upLoadImage };

const mapStateToProps = (state) => ({
    user: state.user,
});

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    upLoadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
