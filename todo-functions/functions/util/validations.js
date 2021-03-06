const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    } else {
        return false;
    }
};

const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    } else {
        return false;
    }
};

exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }

    if (isEmpty(data.user)) {
        errors.user = "Must not be empty";
    }

    if (isEmpty(data.password)) {
        errors.password = "Must not be empty";
    }

    if (data.password !== data.confirmPassword) {
        errors.password = "Password must match";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

exports.validateLoginData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    }

    if (isEmpty(data.password)) {
        errors.password = "Must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio)) {
        userDetails.bio = data.bio;
    }

    if (!isEmpty(data.website)) {
        if (!/http/.test(data.website.trim())) {
            userDetails.website = `http://${data.website}`;
        } else {
            userDetails.website = data.website;
        }
    }

    if (!isEmpty(data.location)) {
        userDetails.location = data.location;
    }

    return userDetails;
};
