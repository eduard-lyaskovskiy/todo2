import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../../src/App.css";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
    card: {
        display: "flex",
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: "cover",
    },
});

class Todo extends Component {
    render() {
        const {
            classes,
            todo: { title, createdAt, userImage, user, todoId, commentCount },
        } = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile image" className={classes.image}></CardMedia>
                <CardContent className="card-content" className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${user}`} color="primary">
                        {user}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {createdAt}
                    </Typography>
                    <Typography variant="body1">{title}</Typography>
                </CardContent>
            </Card>
        );
    }
}

Todo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Todo);
