import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
//Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
//Redux stuff
import { connect } from "react-redux";
import { postTodo, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.spreadThis,
    submitButton: {
        position: "relative",
        float: "right",
        marginTop: "10px",
    },
    progressSpiner: {
        position: "absolute",
    },
    closeButton: {
        position: "absolute",
        left: "92%",
        top: "0%",
    },
});
class PostTodo extends Component {
    state = {
        open: false,
        title: "",
        errors: {},
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors,
            });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ title: "", open: false, errors: {} });
        }
    }
    hadleOpen = () => {
        this.setState({
            open: true,
        });
    };
    hadleClose = () => {
        this.props.clearErrors();
        this.setState({
            open: false,
            errors: {},
        });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postTodo({ title: this.state.title });
    };
    render() {
        const { errors } = this.state;
        const {
            classes,
            UI: { loading },
        } = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.hadleOpen} tip="Post a new 2DO!">
                    <AddIcon />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.hadleClose} maxWidth="sm" fullWidth>
                    <MyButton tip="Close" onClick={this.hadleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Post a new 2DO</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="title"
                                type="text"
                                label="Title"
                                multiline
                                rows="3"
                                placeholder="Add text here"
                                error={errors.title ? true : false}
                                helperText={errors.title}
                                className={classes.TextField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                Submit
                                {loading && <CircularProgress size={30} className={classes.progressSpiner} />}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}
PostTodo.propTypes = {
    postTodo: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
});
export default connect(mapStateToProps, { postTodo, clearErrors })(withStyles(styles)(PostTodo));
