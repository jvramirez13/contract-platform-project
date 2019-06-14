import React from "react";
import CompanyNavbar from "./StudentNavbar.js";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import HeaderLogo from "./HeaderLogo.png";
import firebaseApp from "./firebaseConfig.js";
import { Avatar } from "antd";
import { Redirect } from "react-router-dom";

// formatting for cards from material UI
function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with love by the "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {" team."}
    </Typography>
  );
}

// formatting for cards from material UI
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class CompanyContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      uid: ""
    };
  }

  componentDidMount() {
    const usersRef = firebaseApp.database().ref(`contracts`);
    usersRef.on("value", snap => {
      let update = snap.val() || [];
      this.updateSnap(update);
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

  updateSnap = value => {
    return new Promise(resolve => {
      if (firebaseApp.auth().currentUser) {
        const { uid } = firebaseApp.auth().currentUser;

        this.setState(
          {
            contracts: value
          },
          () => {
            resolve();
          }
        );
      }
    });
  };

  render() {
    const { users } = this.state;
    const { uid } = this.state.uid;
    const { currentUser } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {firebaseApp.auth().currentUser ? "" : this.setRedirect()}
        {this.renderRedirect()}
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
                <CompanyNavbar />
              </div>
            </Toolbar>
          </AppBar>

          {/* Footer */}
          <footer className={classes.footer}>
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

export default withStyles(useStyles)(CompanyContract);
