import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
//Icon
import DoneOutline from "@material-ui/icons/DoneOutline";
//Redux
import { connect } from "react-redux";
import { doneTodo } from "../redux/actions/dataActions";

const styles = {
    deleteButton: {
        position: "absolute",
        left: "90%",
        top: "10%",
    },
};
class DoneTodo extends Component {
    state = {
        open: false,
    };
    hadleOpen = () => {
        this.setState({ open: true });
    };
    hadleClose = () => {
        this.setState({ open: false });
    };
    doneTodo = () => {
        this.props.doneTodo(this.props.todoId);
        this.setState({ open: false });
    };
    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton tip="Done 2DO" onClick={this.hadleOpen} btnClassName={classes.deleteButton}>
                    <DoneOutline color="secondary" />
                </MyButton>
                <Dialog open={this.state.open} close={this.hadleClose} fullWidth maxWidth="xs">
                    <DialogTitle>All is done?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.hadleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.doneTodo} color="secondary">
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}
DoneTodo.propTypes = {
    doneTodo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    todoId: PropTypes.string.isRequired,
};
export default connect(null, { doneTodo })(withStyles(styles)(DoneTodo));
