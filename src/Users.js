import React from "react";
import { Redirect } from "react-router-dom";
import firebaseApp from "./firebaseConfig";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.location.state;
  }

  
  createInDatabase = () => {
    console.log("in create in database")
    console.log(this.state)
    if (this.state.status === "new user"){
      // send an error back to login page to say they need to register first
      console.log("not a user yet!"); 
    }
    else {
    const usersRef = firebaseApp.database().ref(`users/${this.state.currentUser}`);
    const user = {
      // student: this.state.student,
      // company: this.state.company,
      status: this.state.status,
      linkedIn: this.state.LinkedIn,
      github: this.state.GitHub,
      currentContracts: [
        {
          title: "first contract",
          description: "hello ther",
          interested: ["q3wr81023984asfd, 23098qskjflasdfj"]
        }
      ],
      pastContracts: [
        {
          title: "old contract",
          description: "GOD BLESS YOU",
          interested: ["q3wr81023984asfd, 23098qskjflasdfj"]
        }
      ],
      username: this.state.username,
      photo: this.state.photo
    };
    usersRef.push(user);
  }
  };

  updateSnap = value => {
    // value is the snap value 
    return new Promise(resolve => {
      console.log('in update snap')
      console.log(value) // should print out list of users
      this.setState(
        {
          // sets users to be a giant list of users
          users: value
        },
        () => resolve() // resolve the promise???
      );
    });
  };

  // changeParent = value => {
  //   this.setState({
  //     users: value
  //   });
  // };

  checkStates = (user) => {
    return user.map(

    )
  }

  renderRedirect = () => {
  
      console.log("attempting to redirect");
      // Figure out whether to render a student or company profile
      console.log("current user object:")
      console.log(this.state.users[this.state.currentUser])
      console.log("trying to access status")
      let user = this.state.users[this.state.currentUser];
      console.log(user.child('status'))
      if (this.state.status === "company") {
        return (
          <Redirect
            to={{
              pathname: "/users/company/profile",
              uid: this.state.currentUser
            }}
          />
        );
      } else if (this.state.status === "student") {
        return (
          <Redirect
            to={{
              pathname: "/users/student/profile",
              uid: this.state.currentUser
            }}
          />
        );
      }
    }
  
  render() {
    return <div> hello </div>;
  }
// {this.state.users ? this.renderRedirect() : null}

  componentDidMount() {
    const usersRef = firebaseApp.database().ref("users");

    usersRef.on("value", snap => {
      let update = snap.val() || [];
      // calls the updateSnap method which creates a promise and sets users to the snap value in state
      this.updateSnap(update).then(() => {
        // if the currentUser's UID is a valid key in the list of users, resolve the promise
        if (this.state.users[this.state.currentUser]) {
          console.log("got here cuz user exists");
          //why doesn't it redirect here?
          Promise.resolve();
          console.log('after the promise in compdidmt')
          this.renderRedirect(); // call redirect here

        } else {
          // if it is an invalid key, create a new user
          this.createInDatabase();
        }
      });

    });
  }

}

export default Users;
