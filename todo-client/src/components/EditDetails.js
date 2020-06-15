import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//Icons
import EditIcon from "@material-ui/icons/Edit";
// Redux stuff
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

const styles = (theme) => ({
    ...theme.spreadThis,
});

class EditDetails extends Component {
    state = {
        bio: "",
        website: "",
        location: "",
        open: false,
    };
    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : "",
            website: credentials.website ? credentials.website : "",
            location: credentials.location ? credentials.location : "",
        });
    };
    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    };
    handleClose = () => {
        this.setState({ open: false });
        this.mapUserDetailsToState(this.props.credentials);
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };
    componentDidMount() {
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    }
    render() {
        const classes = this.props;
        return (
            <Fragment>
                <Tooltip title="Edit details" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.button} style={{ float: "right" }}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.TextField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your website"
                                className={classes.TextField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.TextField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    credentials: state.user.userData.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));
