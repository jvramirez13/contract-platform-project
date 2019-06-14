import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Navbar from "./CompanyNavbar";
import HeaderLogo from "./HeaderLogo.png";
import firebaseApp from "./firebaseConfig.js";

const useStyles = makeStyles(theme => ({
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
}));

const cards = [0, 1];

var names = [];
var userList = [];

class AllStudentsCopy extends React.Component {
  state = {
    users: []
  };
  componentDidMount() {
    var ref = firebaseApp.database().ref("students");
    ref.once("value").then(function(snapshot) {
      for (var key in snapshot.val()) {
        userList.push(key);
      }
    });

    ref.once("value").then(snapshot => {
      for (var key in snapshot.val()) {
        var tasksRef = firebaseApp.database().ref("students/" + key);
        tasksRef.on("value", snapshot => {
          if (snapshot.val() != null) {
            console.log(Object.values(snapshot.val())[3]);
            names.push(Object.values(snapshot.val())[3]);
          }
        });
        userList.push(key);
      }
      console.log(names[0]);
    });

    var tasksRef = firebaseApp
      .database()
      .ref("students/" + firebaseApp.auth().currentUser.uid);
    tasksRef.on("value", snapshot => {
      if (snapshot.val() != null) {
        console.log(Object.values(snapshot.val())[0].username);
      }
    });
    console.log(names);
  }

  render() {
    return (
      <div>
        <renderRedirect />
        <useForceUpdate />
        <React.Fragment>
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
            <div>
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  Students
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  A list of all the students available to work for companies!
                </Typography>
                <div>
                  <Grid container spacing={2} justify="center" />
                </div>
              </Container>
            </div>
            <Container maxWidth="md">
              {/* End hero unit */}

              <Grid container spacing={4}>
                {cards.map(card => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <setState />
                        <setState />
                        {names[card]}
                        <Typography>Contract Details</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          I'm Interested!
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </main>
          {/* Footer */}
          <footer>
            <Typography variant="h6" align="center" gutterBottom>
              Footer
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              component="p"
            >
              Something here to give the footer a purpose!
            </Typography>
          </footer>
          {/* End footer */}
        </React.Fragment>
      </div>
    );
  }
}

export default AllStudentsCopy;
