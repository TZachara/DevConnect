import React , {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData ] = useState({
        email:'',
        password:'',
    });

    const {email, password} = formData;

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value,})

    const handleSubmit = async (e) => {
        e.preventDefault();
        login({email, password});
    }

    // Redirect if logged in
    if(isAuthenticated){
        return <Redirect to="/dashboard"/>
    }

    return (
        <section>
            <h1 className="large text-primary">Sign in</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={ (e) => {handleSubmit(e)}}> 
                <div className="form-group">
                    <input type="email" name="email"  placeholder="Email" value={email} onChange={(e)=>handleChange(e)}/>
                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>handleChange(e)}/>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Login"/>
                </div>
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </section>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, {login})(Login)
