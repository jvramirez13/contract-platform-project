import React from "react";
import firebaseApp from "./firebaseConfig";
import {Container, Paper, Card, Chip, Button, Typography, Input} from "@material-ui/core";
import LoginLogo from "./LoginLogo.png";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import "./App.css";

// sub-class for displaying Student form
export class RegisterStudent extends React.Component{

    state = {
        linkedIn: '',
        github: '',
        status: "student"
    }

    setLinkedIn = (input) => {
        this.setState({
            linkedIn: input
        })
    }

    setGithub = (input) => {
        this.setState({
            github: input
        })
    }

    render(){
        return(
            <Container maxWidth="sm">

                <div className="input">
                    <div>Linked In Link: </div>
                    <Input onChange={(e)=>this.setLinkedIn(e.target.value)} type="outlined">Linked In:</Input>
                </div>

                <div className="input">
                    <div>GitHub Link: </div> 
                    <Input onChange={(e)=>this.setGithub(e.target.value)} type="outlined">GitHub:</Input>
                </div>

                <Button onClick={()=>{this.props.setStudentFields(this.state)}} color="primary">
                    Register and Connect to Google
                </Button>

            </Container>
        )
    }
}

// sub-class for displaying Company form
export class RegisterCompany extends React.Component{

    state = {
        name: "",
        website: "",
        status: "company"
    }

    setName = (input) => { 
        this.setState({
            name: input
        })
    }

    setWebsite = (input) => {
        this.setState({
            website: input
        })
    }
    render() {
        return(
            <Container maxWidth="sm">

                <div className="input">
                    <div>Company Name: </div>
                    <Input onChange={(e)=>this.setName(e.target.value)} type="outlined">CompanyName:</Input>
                </div>

                <div className="input">
                    <div>Website Link: </div> 
                    <Input onChange={(e)=>this.setWebsite(e.target.value)} type="outlined">Website:</Input>
                </div>

                <Button onClick={()=>{this.props.setCompanyFields(this.state)}} color="primary">
                    Register and Connect to Google
                </Button>

            </Container>
        )
    }
}

// controls generic registering
class Register extends React.Component {

    state={
        status:"none",
        linkedIn: "",
        website: "",
        name: ""
    }

    setStatus = (event) => {
        this.setState({
          status: event.target.value
        })
    }

    render(){
        return(
            
            <Container maxWidth="sm">
                <br/>
                <hr></hr>
                <br/>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Register as a:</FormLabel> 
                    <RadioGroup aria-label="position" name="position" onChange={this.setStatus} row>
                        <FormControlLabel
                        value="student"
                        control={<Radio color="primary" />}
                        label="Student"
                        labelPlacement="start"
                        />
                        <FormControlLabel
                        value="company"
                        control={<Radio color="primary" />}
                        label="Company"
                        labelPlacement="start"
                        />
                    </RadioGroup> 
                    
                    {this.state.status === "student" ? <RegisterStudent setStudentFields={this.props.setStudentFields} /> : <div></div>}
                    {this.state.status === "company" ? <RegisterCompany setCompanyFields={this.props.setCompanyFields} /> : <div></div>} 
                </FormControl>


            </Container>
        )
    }


}

export default Register;