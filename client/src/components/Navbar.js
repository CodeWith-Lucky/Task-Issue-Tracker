import React from 'react';
import { Link ,NavLink} from 'react-router-dom';
import './Navbar.css';
import {logo} from './Logo.js'; // Ensure this is correctly imported



const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav" style={{ marginLeft: "12px" }}>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" exact to="/" activeClassName="active">Manage Tasks</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/add-task" activeClassName="active">Add Task</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/manage-client" activeClassName="active">Manage Client</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}


export default Navbar;
