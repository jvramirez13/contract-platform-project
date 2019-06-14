import React from "react";
import ForumComment from "./ForumComment.js";
import ForumPost from "./ForumPost.js";
import { Button, Input } from "antd";
import "./ForumPage.css";
import Typography from "@material-ui/core/Typography";
import firebaseApp from "./firebaseConfig";
import StudentNavbar from "./StudentNavbar.js";
import HeaderLogo from "./HeaderLogo.png";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 275
  }
}));

const { TextArea } = Input;
export default class ForumPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      details: "",
      posts: [],
      oldPosts: [],
      oldComments: [],
      currentUser: null,
      postid: ""
    };

    this.createInDatabase = this.createInDatabase.bind(this);
  }

  createPost = event => {
    this.createInDatabase().then(() => {
      //   console.log(this.state.postid);
      //   var newArray = this.state.posts.slice();
      //   newArray.unshift({
      //     post: (
      //       <ForumPost
      //         title={this.state.title}
      //         details={this.state.details}
      //         currentUser={firebaseApp.auth().currentUser.displayName} //this is just the persons name
      //       />
      //     ),
      //     // Pass postId as a prop to ForumComment
      //     comments: <ForumComment comments={[]} postid={this.state.postid} />
      //   });
      //   this.setState({
      //     posts: newArray
      //   });
    });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  mapAllPosts = () => {
    let oldPosts = this.state.oldPosts;
    return oldPosts.map(item => {
      return (
        <div
          style={{
            borderStyle: "solid"
          }}
        >
          <Grid item xs={6}>
            {item.post}
            {item.comments}
          </Grid>
        </div>
      );
    });
  };

  // to render posts/comments made in real-time
  // mapPosts = () => {
  //   let posts = this.state.posts;
  //   console.log(posts);
  //   return posts.map(item => {
  //     return (
  //       <div
  //         style={{
  //           borderStyle: "solid",
  //           padding: "20px"
  //         }}
  //       >
  //         <Grid item xs={6}>
  //           {item.post}
  //           {item.comments}
  //         </Grid>
  //       </div>
  //     );
  //   });
  // };

  componentDidMount() {
    const usersRef = firebaseApp.database().ref("students");
    usersRef.on("value", snap => {
      let update = snap.val() || [];
      this.updateSnap(update);
    });

    const postsRef = firebaseApp.database().ref("posts");

    postsRef.on("value", snap => {
      let posts = snap.val() || [];
      // console.log(posts);
      this.updatePosts(posts);
      // console.log(posts);
      let oldPostsState = [];
      for (let post in posts) {
        let oldComments = [];
        for (let comment in posts[post].comments) {
          const oldComment = {
            author: posts[post].comments[comment].author,
            avatar: posts[post].comments[comment].avatar,
            content: posts[post].comments[comment].details,
            dateTime: moment().fromNow(),
            postid: posts[post].comments[comment].postid
          };
          oldComments.unshift(oldComment);
        }
        oldPostsState.unshift({
          post: (
            <ForumPost
              title={posts[post].title}
              details={posts[post].details}
              currentUser={posts[post].author}
              postid={post}
            />
          ),
          comments: <ForumComment postid={post} oldComments={oldComments} />
        });
      }
      this.setState({
        oldPosts: oldPostsState
      });
    });
  }
  updatePosts = value => {
    // console.log(value);
    return new Promise(resolve => {
      const { uid } = firebaseApp.auth().currentUser;
      let arr = Object.keys(value).map(k => value[k]);
      this.setState(
        {
          postsNew: value
        },
        () => {
          resolve();
        }
      );
    });
  };

  updateSnap = value => {
    return new Promise(resolve => {
      const { uid } = firebaseApp.auth().currentUser;

      let currentUser = "";
      for (let user in value) {
        //  console.log(value[user].uid);
        if (value[user].uid === uid) {
          currentUser = value[user];
        }
      }

      this.setState(
        {
          users: value,
          currentUser: currentUser,
          uid: uid
        },
        () => {
          resolve();
        }
      );
    });
  };
  async createInDatabase() {
    let currentTime = new Date().toLocaleString();
    const postsRef = firebaseApp.database().ref("posts");
    const post = {
      author: firebaseApp.auth().currentUser.displayName,
      title: this.state.title,
      details: this.state.details,
      timestamp: currentTime,
      // postId: this.state.postId,
      comments: []
    };

    let postid = await postsRef.push(post).key;
    console.log(postid);
    this.setState({
      postid: postid
    });
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  render() {
    return (
      <div className="container">
        {firebaseApp.auth().currentUser ? "" : this.setRedirect()}
        {this.renderRedirect()}
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <img src={HeaderLogo} height="80" alt="Logo" />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                float: "right",
                textAlign: "right",
                display: "inline - block",
                width: "98%",
                padding: "10px",
                justifyContent: "space-between"
              }}
            >
              <StudentNavbar />
            </div>
          </Toolbar>
        </AppBar>
        {/* <Grid item xs ={12}> */}
        <br />
        <Container className="login" maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Developer Forum
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Learn, share, and build with other developers in the RevTek
            community! Give back some knowledge to others and share a post
            today.
          </Typography>
        </Container>
        {/* </Grid> */}
        <div className="postBar">
          <div>
            <Input
              name="title"
              placeholder="Title of Post"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextArea
              name="details"
              placeholder="Post details..."
              value={this.state.details}
              onChange={this.handleChange}
              rows={4}
            />
          </div>
        </div>
        <div>
          <Button onClick={this.createPost}>Create Post</Button>
        </div>
        <br />
        <br />
        <div className="postHistory">
          {/* <Grid 
        alignContent={"space between"}
        container spacing={3}> */}
          {this.state.oldPosts.length > 0 && this.mapAllPosts()}
          {/* {this.state.posts.length > 0 && this.mapPosts()} */}
          {/* </Grid> */}
        </div>
      </div>
    );
  }
}
