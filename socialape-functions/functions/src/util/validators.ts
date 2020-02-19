import {Request} from "express";

export const isEmpty = (str: string) => {
    return (!(str && str.trim().length > 0));
};

export const isEmail = (email: string) => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

export interface LoginErrors {
    email?: string
    password?: string
    confirmPassword?: string
    handle?: string
}

interface ValidationResult {
    valid: boolean
    errors: LoginErrors
    handle?: string
    email: string
    password: string
}

export const validateSignupData = (req: Request): ValidationResult => {
    const {email, password, handle, confirmPassword} = req.body;

    let errors: LoginErrors = {};
    if (isEmpty(email)) {
        errors.email = 'Email must not be empty';
    }
    else if (!isEmail(email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(password)) errors.password = 'Password must not be empty';
    if (password !== confirmPassword) errors.confirmPassword = 'Password and confirmation must match';
    if (isEmpty(handle)) errors.handle = 'Handle must not be empty';

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        handle,
        email,
        password
    };
};

export const validateLoginData = (req:Request): ValidationResult => {
    const {email, password} = req.body;

    let errors: LoginErrors = {};
    if (isEmpty(email)) errors.email = 'Email must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        email,
        password
    };
};