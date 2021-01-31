import React , {useState} from 'react'
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom'
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData ] = useState({
        name: '',
        email:'',
        password:'',
        password2:'',
    });

    const {name, email, password, password2} = formData;

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value,})

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Password do not match!','danger')
        } else {
            register({name, email, password});
        }
    }
        // Redirect if logged in
        if(isAuthenticated){
            return <Redirect to="/dashboard"/>
        }

    return (
        <section>
            <h1 className="large text-primary">Sign up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={ (e) => {handleSubmit(e)}}> 
                <div className="form-group">
                    <input type="text" name="name"  placeholder="Name" value={name} onChange={(e)=>handleChange(e)}/>
                </div>
                <div className="form-group">
                    <input type="email" name="email"  placeholder="Email" value={email} onChange={(e)=>handleChange(e)}/>
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile picture, use a Gravatar email.
                    </small>
                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>handleChange(e)}/>
                    </div>
                    <div className="form-group">
                        <input type="password" name="password2" id="" placeholder="Confrim Password" value={password2} onChange={(e)=>handleChange(e)}/>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register"/>
                </div>
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </section>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProp = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProp, {setAlert, register})(Register);
