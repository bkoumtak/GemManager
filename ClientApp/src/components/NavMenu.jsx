import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { authenticationService } from '../_services/authentication.service'; 
import { Role } from '../_helpers/role'; 
import { history } from '../_helpers/history';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { UserPage } from './UserPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            currentUser: null, 
            isAdmin: false,
            isUser: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin,
            isUser: x && x.role === Role.User
        }));
    }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
   }

    logout() {
        authenticationService.logout(); 
        history.push('/'); 
  }

    render() {
        const { currentUser, isAdmin, isUser } = this.state; 
    return (
        <header style={{
            width: '90%',
            margin: '0 auto'
        }}>
          <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom shadow mb-3 rounded-bottom" light>
              <Container>
                    <ul className="navbar-nav flex-grow col-4">
                        {currentUser &&
                        <>
                        

                        
                                   
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/user-page">
                                                Send Gem
                                    </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/gems-received-page">
                                                Gems Received
                                    </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/gems-sent-page">
                                                Gems Sent
                                    </NavLink>
                                        </NavItem>
                                    
                         
                            </>
                         }
                    </ul>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <NavbarBrand tag={Link} to="/" style={{ textAlign: "center" }}><img src="logo.png" /></NavbarBrand>
                        </div>
                  <Collapse className="d-sm-inline-flex flex-sm-row-reverse col-4" isOpen={!this.state.collapsed} navbar>
                      <ul className="navbar-nav flex-grow">
                                                   {!currentUser && 
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/login">Log-in</NavLink>
                        </NavItem>
                }
                          {currentUser &&
                    <>
{isAdmin &&
                                    <>
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/user-management">
                                                User Management
                                     </NavLink>
                                        </NavItem>
                                    </>
                                }
                        <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                              {currentUser.username}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                              <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                    </>
                }
                            
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
