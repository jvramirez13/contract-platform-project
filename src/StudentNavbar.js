import React from "react";
import { NavLink } from "react-router-dom";
import firebase from "./firebaseConfig.js";
import { Redirect } from "react-router-dom";
import { Menu, Icon } from "antd";

class StudentNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  

  setRedirect = () => {
    firebase.auth().signOut();
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    console.log(this.props.titles)
    return (
      <div>
        {this.renderRedirect()}
        <Menu
          style={{ background: "transparent", border: "none" }}
          mode="horizontal"
        >
          <Menu.Item>
            <NavLink
              style={{ color: "white" }}
              to={{
                pathname: "/users/student/profile",
                titles: this.props.titles,
                details: this.props.details
              }}
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="home" />
              Student Profile
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink
              style={{ color: "white" }}
              to="/users/student/contracts"
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="container" />
              Contracts
            </NavLink>
          </Menu.Item>
          <Menu.Item style={{ color: "white" }}>
            <NavLink
              style={{ color: "white" }}
              to="/users/student/forum"
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="edit" />
              Forum
            </NavLink>
          </Menu.Item>
          <Menu.Item style={{ color: "white" }}>
            <NavLink style={{ color: "white" }} onClick={this.setRedirect}>
              <Icon type="poweroff" />
              Logout
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
export default StudentNavbar;
