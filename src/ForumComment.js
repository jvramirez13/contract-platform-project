import { Comment, Avatar, Form, Button, List, Input } from "antd";
import moment from "moment";
import React from "react";
import firebaseApp from "./firebaseConfig";

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

export default class ForumComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.oldComments,
      submitting: false,
      value: "",
      postid: this.props.postid
    };
  }

  getDerivedStateFromProps(nextProps, prevState) {
    return {
      comments: nextProps.oldComments
    };
  }

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });

    const commentsRef = firebaseApp
      .database()
      .ref("posts/" + this.props.postid + "/comments");
    let currentTime = new Date().toLocaleString();
    const comment = {
      author: firebaseApp.auth().currentUser.displayName,
      avatar: firebaseApp.auth().currentUser.photoURL,
      details: this.state.value,
      timestamp: currentTime,
      postid: this.props.postid
    };
    commentsRef.push(comment);

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: "",
        comments: [
          {
            author: firebaseApp.auth().currentUser.displayName,
            avatar: firebaseApp.auth().currentUser.photoURL,
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow(),
            postid: this.props.postid
          },
          ...this.state.comments
        ]
      });
    }, 1000);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          style={{ width: "550px" }}
          avatar={
            <Avatar
              src={firebaseApp.auth().currentUser.photoURL}
              alt={firebaseApp.auth().currentUser.displayName}
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
              rows={2}
            />
          }
        />
      </div>
    );
  }
}
