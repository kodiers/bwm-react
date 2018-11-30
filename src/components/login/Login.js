import React from 'react';

import LoginForm from './LoginForm';


export class Login extends React.Component {

    loginUser(userData) {

    }

    render() {
        return (
            <section id="login">
                <div className="bwm-form">
                    <div className="row">
                        <div className="col-md-5">
                            <h1>Login</h1>
                            <LoginForm submitCb={this.loginUser}/>
                        </div>
                        <div className="col-md-6 ml-auto">
                            <div className="image-container">
                                <h2 className="catchphrase">Hundreds of awesome places in reach of few clicks.</h2>
                                <img src='' alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
