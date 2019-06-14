import React from "react";
import { Redirect, NavLink } from "react-router-dom";
import { Menu, Icon } from "antd";
import firebaseApp from "./firebaseConfig.js";

var names = [];

var emails = [];

var githubs = [];

var linkedIns = [];

var photourl = [];

var realCount = 0;

var list = [];

class CompanyNavbar extends React.Component {
  state = {
    redirect: false,
    userState: [],
    emailState: [],
    githubState: [],
    linkedinState: [],
    photoState: [],
    num: 0
  };

  componentDidMount = () => {
    //might need later
    var ref = firebaseApp.database().ref("students");
    /*
    ref.once("value").then(function(snapshot) {
      for (var key in snapshot.val()) {
        userList.push(key);
      }
    }); */

    ref.once("value").then(function(snapshot) {
      var count = 0;
      if (names.length === 0) {
        for (var key in snapshot.val()) {
          var tasksRef = firebaseApp.database().ref("students/" + key);
          tasksRef.on("value", snapshot => {
            if (snapshot.val() != null) {
              //console.log(Object.values(snapshot.val()));
              //console.log(Object.values(snapshot.val())[3]);
              emails.push(Object.values(snapshot.val())[0]);
              githubs.push(Object.values(snapshot.val())[1]);
              linkedIns.push(Object.values(snapshot.val())[2]);
              names.push(Object.values(snapshot.val())[3]);
              photourl.push(Object.values(snapshot.val())[4]);
            }
          });
          count++;
        }
        realCount = count;
      }
    });

    this.setState({
      userState: names,
      githubState: githubs,
      linkedinState: linkedIns,
      emailState: emails,
      photoState: photourl,
      num: realCount
    });

    /* var tasksRef = firebaseApp
      .database()
      .ref("students/" + firebaseApp.auth().currentUser.uid);
    tasksRef.on("value", snapshot => {
      if (snapshot.val() != null) {
        console.log(Object.values(snapshot.val())[0].username);
      }
    });
    console.log(names); */
  };

  setRedirect = () => {
    firebaseApp.auth().signOut();
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
              to="/users/company/profile"
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="home" />
              Company Profile
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink
              style={{ color: "white" }}
              to="/users/company/newcontract"
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="container" />
              New Contract
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink
              style={{ color: "white" }}
              to={{
                pathname: "/users/company/students",
                users: this.state.userState,
                emails: this.state.emailState,
                github: this.state.githubState,
                linkedIn: this.state.linkedinState,
                url: this.state.photoState,
                num: realCount
              }}
              activeStyle={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              <Icon type="idcard" />
              View Students
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
export default CompanyNavbar;
