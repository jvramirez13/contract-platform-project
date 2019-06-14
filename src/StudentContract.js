import React from "react";
import StudentNavbar from "./StudentNavbar.js";
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
    marginTop: theme.spacing(4),
    marginLeft: "60px"
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

class StudentContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      uid: "",
      all_contracts: []
    };
  }

  componentDidMount() {
    const contractsRef = firebaseApp.database().ref(`contracts`);
    contractsRef.on("value", snap => {
      let contracts = snap.val() || [];
      this.updateSnap(contracts);
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

  updateSnap = contracts => {
    return new Promise(resolve => {
      let all_contracts = [];

      for (let contract in contracts){
        if (contracts[contract].date_completed){
          continue;
        }
        else {
          let new_contract = contracts[contract];
          new_contract["firebaseKey"] = contract;
          all_contracts.push(new_contract);
        }
      }
      this.setState(
          {
            all_contracts: all_contracts
          },
          () => {
            resolve();
          }
        );
      }
    );
  }

  
  addInterest = (contractFirebaseKey) => {
    let currentStudentUID = firebaseApp.auth().currentUser.uid; // google auth id
    let all_interested = [];
    all_interested.push(currentStudentUID)
    const interestedStudentsRef = firebaseApp.database().ref(`contracts/${contractFirebaseKey}/interested_students`);
    interestedStudentsRef.on("value", snap => {
      let studentIDs = snap.val();
      if (studentIDs){
        Object.keys(studentIDs).map(
          (key) => {
            if (studentIDs[key] !== currentStudentUID){
              all_interested.push(studentIDs[key])
            }
          }
        )
      }
    })
    interestedStudentsRef.set(all_interested);

  }


  render() {

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
                <StudentNavbar />
              </div>
            </Toolbar>
          </AppBar>

          <main>
            <br/>
            <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Contract Marketplace
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Show your interest in these open contracts to get connected with companies!
          </Typography>
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}

              <Grid container spacing={4}>
                {this.state.all_contracts.map(card => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.title}
                        </Typography>
                        <Typography>{card.details}</Typography>
                      </CardContent>
                      Payment: ${card.payment}
                      <CardActions>
                        <Button size="small" color="primary" onClick={()=>this.addInterest(card.firebaseKey)} style={{marginLeft:"60px"}}>
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

export default withStyles(useStyles)(StudentContract);
