import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MyButton from "../../util/MyButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
//dayjs
import dayjs from "dayjs";
//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
//Redux stuff
import { connect } from "react-redux";
import { getTodo, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.spreadThis,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: "50%",
        objectFit: "cover",
    },
    dialogContent: {
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        left: "90%",
    },
    expandButton: {
        position: "absolute",
        left: "90%",
    },
    spinner: {
        textAlign: "center",
        marginTop: 50,
        marginBottom: 50,
    },
});

class TodoDialog extends Component {
    state = {
        open: false,
    };
    hadleOpen = () => {
        this.setState({
            open: true,
        });
        this.props.getTodo(this.props.todoId);
    };
    hadleClose = () => {
        this.setState({
            open: false,
        });
        this.props.clearErrors();
    };
    render() {
        const {
            classes,
            todo: { todoId, title, createdAt, userUser, userImage, commentCount, comments },
            UI: { loading },
        } = this.props;
        const dialogMarkup = loading ? (
            <div className={classes.spinner}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt="user-image" className={classes.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} color="primary" variant="h5" to={`users/${userUser}`}>
                        @{userUser}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">{title}</Typography>
                    <MyButton tip="comments">
                        <ChatIcon color="primary"></ChatIcon>
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeparator} />
                <CommentForm todoId={todoId} />
                <Comments comments={comments} />
            </Grid>
        );
        return (
            <Fragment>
                <MyButton onClick={this.hadleOpen} tip="Expand todo" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.hadleClose} maxWidth="sm" fullWidth>
                    <MyButton tip="Close" onClick={this.hadleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>{dialogMarkup}</DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

TodoDialog.propTypes = {
    getTodo: PropTypes.func.isRequired,
    todoId: PropTypes.string.isRequired,
    userUser: PropTypes.string.isRequired,
    todo: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    todo: state.data.todo,
    UI: state.UI,
});

export default connect(mapStateToProps, { getTodo, clearErrors })(withStyles(styles)(TodoDialog));
