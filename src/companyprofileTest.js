import React from "react";
import CompanyNavbar from "./CompanyNavbar.js";
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
import * as firebase from "firebase/app";
import { Avatar } from "antd";
import { Redirect } from "react-router-dom";

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
    padding: theme.spacing(8, 0.5, 6)
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
    padding: "20px",
    marginTop: "50px"
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

class CompanyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCompany: null,
      uid: "",
      company_contracts: []
    };
  }

  componentDidMount() {
    const companiesRef = firebaseApp.database().ref(`companies`);
    const googleUID = firebaseApp.auth().currentUser;
    companiesRef.on("value", snap => {
      let companies = snap.val();
      // let currentCompany = '';
      // let firebaseKey = '';
      // for (let company in companies) {
      //   if (companies[company].uid === googleUID){
      //     firebaseKey = company;
      //     currentCompany = companies[company];
      //     this.setState({
      //       all_companies: companies,
      //       currentCompany: currentCompany,
      //       firebaseKey: firebaseKey
      //     }, this.getContracts)
      //   }
      // }
      this.updateSnap(companies).then(this.getContracts);
    });
  }

  getContracts = () => {
    console.log("inside getCOntracts");
    const contractsRef = firebaseApp.database().ref(`contracts/`);
    contractsRef.on("value", snap => {
      let contracts = snap.val();
      let company_contracts = [];
      for (let contract in contracts) {
        if (this.state.currentCompany.uid === contracts[contract].company_id) {
          company_contracts.push(contracts[contract]);
        }
      }
      this.setState({
        all_contracts: contracts,
        company_contracts: company_contracts
      });
    });
  };

  updateSnap = companies => {
    return new Promise(resolve => {
      if (firebaseApp.auth().currentUser) {
        const { uid } = firebaseApp.auth().currentUser;

        let currentCompany = "";
        let firebaseKey = "";
        for (let company in companies) {
          //console.log(value[user].uid);
          if (companies[company].uid === uid) {
            firebaseKey = company;
            currentCompany = companies[company];
            //console.log(currentCompany)
          }
        }

        this.setState(
          {
            all_companies: companies,
            currentCompany: currentCompany,
            firebaseKey: firebaseKey
          },
          () => {
            resolve();
          }
        );
      }
    });
  };

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

  handleClick = (event, card) => {
    event.preventDefault();
    const { all_contracts } = this.state;
    console.log(all_contracts);
    let contract_key = "";
    Object.keys(all_contracts).map(key => {
      if ((all_contracts[key].details = card.details)) {
        contract_key = key;
      }
    });

    console.log(`${contract_key}`);
    const contractRef = firebaseApp.database().ref(`contracts/${contract_key}`);

    contractRef.remove().then(() => {
      console.log("remove succeeded");
    });
  };

  render() {
    // const { users } = this.state;
    // const { uid } = this.state.uid;
    const { currentCompany } = this.state;
    const { classes } = this.props;
    return (
      <div>
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
          <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  {this.state.currentCompany ? (
                    this.state.currentCompany.name.toUpperCase()
                  ) : (
                    <div />
                  )}
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  <Avatar
                    size={192}
                    src={
                      firebaseApp.auth().currentUser
                        ? firebaseApp.auth().currentUser.photoURL
                        : this.setRedirect()
                    }
                  />
                </Typography>
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <a
                        target="_blank"
                        href={currentCompany ? currentCompany.website : ""}
                      >
                        <Button variant="contained" color="primary">
                          Website
                        </Button>
                      </a>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}

              <Grid container spacing={4}>
                {this.state.company_contracts.map(card => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      {/* <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  /> */}
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.title}
                        </Typography>
                        <Typography>{card.details}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={event => this.handleClick(event, card)}
                        >
                          Delete
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

export default withStyles(useStyles)(CompanyProfile);
