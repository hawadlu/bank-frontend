import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";

export const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{email: '', password: ''}}
                validate={values => {
                    const errors = {};
                    if (!values.email) {
                        console.log('Email is required');
                        // errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        console.log('Invalid email address');
                        // errors.email = 'Invalid email address';
                    }
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Field type="email" name="email"/>
                        <ErrorMessage name="email" component="div"/>
                        <Field type="password" name="password"/>
                        <ErrorMessage name="password" component="div"/>
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}