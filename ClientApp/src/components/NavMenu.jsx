import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { authenticationService } from '../_services/authentication.service'; 
import { Role } from '../_helpers/role'; 
import { history } from '../_helpers/history';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { UserPage } from './UserPage';

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
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">GemManager</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/user-page">User Page</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/gems-received-page">Gems Received</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/gems-sent-page">Gems Sent</NavLink>
                </NavItem>
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
                                <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/add-user">
                                            Add User
                                        </NavLink>
                                </NavItem>
                            </>
                        }
                        {isUser &&
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/gem-transfer">
                                    Gem Transfer
                                </NavLink>
                            </NavItem>
                        }
                        <a onClick={this.logout} className="nav-item nav-link">Logout</a>
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
