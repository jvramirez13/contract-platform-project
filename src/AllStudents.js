import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Navbar from "./CompanyNavbar";
import HeaderLogo from "./HeaderLogo.png";
import firebaseApp from "./firebaseConfig.js";
import { Redirect } from "react-router-dom";
import githubLogo from "./githubLogo.png";
import linkedinLogo from "./linkedinLogo.png";
const useStyles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
});

var names = [];

var emails = [];

var githubs = [];

var linkedIns = [];

var photourl = [];

class AllStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    names = this.props.location.users;
    emails = this.props.location.emails;
    githubs = this.props.location.github;
    linkedIns = this.props.location.linkedIn;
    photourl = this.props.location.url;

    const { classes } = this.props;

    return (
      <div>
        {firebaseApp.auth().currentUser ? "" : this.setRedirect()}
        {this.renderRedirect()}
        <React.Fragment>
          {console.log(names)}
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
                <Navbar />
              </div>
            </Toolbar>
          </AppBar>
          <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <br />
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  All Students
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  A list of all the students available to work for companies!
                </Typography>
                {/* <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center" />
                </div> */}
              </Container>
            </div>

            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}

              <Grid container spacing={4}>
                {names
                  ? names.map((card, index) => (
                      <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                          <CardContent
                            style={{
                              fontFamily: "Helvetica Neue",
                              fontWeight: "bold",
                              fontSize: "30px"
                            }}
                          >
                            {names[index]}
                          </CardContent>
                          <CardContent
                            style={{
                              fontFamily: "Helvetica Neue"
                            }}
                          >
                            Email: {emails[index]}
                          </CardContent>

                          <CardContent
                            style={{
                              fontFamily: "Helvetica Neue",

                              display: "flex-end"
                            }}
                          />

                          <CardContent
                            style={{
                              fontFamily: "Helvetica Neue",

                              display: "flex"
                            }}
                          >
                            {linkedIns[card]}
                            <div
                              marginRight="50px"
                              style={{ marginLeft: "60px", marginTop: "0px" }}
                            >
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={githubs[index]}
                              >
                                <img
                                  alt="logo"
                                  src={githubLogo}
                                  justifyContent="center"
                                  height="48px"
                                  width="48px"
                                  marginRight="50px"
                                />
                              </a>
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={linkedIns[index]}
                                style={{ marginLeft: "20px" }}
                              >
                                <img
                                  alt="logo"
                                  src={linkedinLogo}
                                  justifyContent="center"
                                  height="48px"
                                  width="55px"
                                />
                              </a>
                            </div>
                          </CardContent>

                          <CardContent style={{ fontFamily: "Helvetica Neue" }}>
                            <img
                              alt="photos"
                              src={photourl[index]}
                              style={{ maxHeight: "70%", maxWidth: "70%" }}
                            />
                          </CardContent>
                          <CardActions />
                        </Card>
                      </Grid>
                    ))
                  : ""}
              </Grid>
            </Container>
          </main>
          {/* Footer */}
          <footer className={classes.footer}>
            <Typography variant="h8" align="center" gutterBottom>
              © Copyright 2019 | RevTech | All Rights Reserved | Privacy Policy
              | Terms and Conditions
            </Typography>
          </footer>
          {/* End footer */}
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(useStyles)(AllStudents);
