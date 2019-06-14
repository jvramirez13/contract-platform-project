import React from "react";
import StudentNavbar from "./StudentNavbar.js";
import ForumPage from "./ForumPage.js";

class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ForumPage />
      </div>
    );
  }
}

export default Forum;
