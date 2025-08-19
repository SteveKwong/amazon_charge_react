import React from 'react';
import './ErrorBox.scss';

interface ErrorBoxProps {
    title?: string;
    message?: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({
                                               title = "There was a problem",
                                               message = "We're sorry. We weren't able to identify you given the information provided.",
                                           }) => {
    return (
        <div className="error-box">
            <div className="error-content">
                <h3 className="error-title">{title}</h3>
                <p className="error-message">{message}</p>
            </div>
        </div>
    );
};

export default ErrorBox;
