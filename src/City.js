import axios from 'axios';
import React, { Component } from 'react'
import { Container,Row,Form,Button, Table,Navbar,Card,ListGroup ,ListGroupItem,Alert} from 'react-bootstrap';


class City extends Component {
    constructor(props){
        super(props);
        this.state={
            userAreaInput:'',
            location:'',
            latitude:'',
            longitude:'',
            mapImg:'.',
            error:'',
            show:false,
            weather:[],
            moveis:[],
            lastDataUpdate:''
        }

    }

    getLocationInput=(e)=>
    {
        this.setState({
            userAreaInput:e.target.value
        })
        console.log(e.target.value);
    }
    getData= async (e)=>
    {   try{
        e.preventDefault();
        let axiosResData= await axios.get(`https://us1.locationiq.com/v1/search.php?key=pk.b848c1ee9a6d10f565222020b02495f1&city=${this.state.userAreaInput}&format=json`);
       
       
        this.setState({
            show:true,
            location:axiosResData.data[0].display_name,
            latitude:axiosResData.data[0].lat,
            longitude:axiosResData.data[0].lon,
            error:"",
            lastDataUpdate:""
            
            
        })
        
        let map=await axios.get(`https://maps.locationiq.com/v3/staticmap?key=pk.b848c1ee9a6d10f565222020b02495f1&center=${this.state.latitude},${this.state.longitude}&zoom=10`);
        this.setState({
            mapImg:map.config.url
            
        })
        let localWeatherData= await axios.get(`${process.env.REACT_APP_SERVER_API}/weather?lat=${this.state.latitude}&lon=${this.state.longitude}`);
        this.setState({
            weather:localWeatherData.data
            
        })
        
        
        let localMoviesData= await axios.get(`${process.env.REACT_APP_SERVER_API}/movies?query=${this.state.userAreaInput}`)
        this.setState({
            moveis:localMoviesData.data,
            lastDataUpdate:localMoviesData.data[localMoviesData.data.length-1].lastUpdate
        })
        console.log(this.state.moveis,'type='+ typeof(this.state.moveis));
        
    }
    catch{
        this.setState({
            show:false,
            error:"Invalid value,please try agin"

        })
    }
        
       
       
    }

    render() {
        return (
                <Container>
                    <Row className="search--section">
                        <Form onSubmit={this.getData}>
                            <Form.Group>
                                <Form.Label>Location :</Form.Label>
                                <Form.Control type="text" placeholder="Amman..."  onChange={(e)=>{this.getLocationInput(e)}}/>
                                <Form.Label className="error-message">{this.state.error}</Form.Label>
                            </Form.Group>
                            <Button type="submit" variant="info">Explore</Button>
                        </Form>
                    </Row>
                    <Row>
                        {
                            this.state.show&&
                            <Alert  variant="warning" className="lastUpdat--box">
                            <span>tha data well update every day</span> <br></br>
                            {'the last update for data is :'+this.state.lastDataUpdate}
                        </Alert>
                        }
                    </Row>
                    <Row>
                        { this.state.show&&
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <h1>{this.state.location}</h1>
                                        </td>
                                        <td>
                                            <h1>{this.state.latitude}</h1>
                                        </td>
                                        <td>
                                            <h1>{this.state.longitude}</h1>
                                        </td>
                                    </tr>
                                    <tr className='img-row'>
                                        <td>
                                            <img src={this.state.mapImg} alt={' '} className='map-img'></img>

                                        </td>
                                    </tr>
                                </tbody> 
                        </Table>
                        }
                        </Row>
                        <Row className="justify-content-center section--title">
                            <Navbar.Text>
                                Weather for 16 day 
                            </Navbar.Text>
                                <i className="uil uil-cloud-moon-meatball"></i>
                            
                        </Row>
                        <Row>
                          
                            <Table responsive className="weather--table">
                                <thead>
                                    <tr>
                                        <th>Day #</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {       
                                    this.state.show&&
                                   this.state.weather.map((value,index)=>{
                                       return(
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                       <td >{value.description}</td>
                                       <td>{value.date}</td>
                                       </tr>
                                       )
                                    })
                                  
                            }
                            </tbody>
                            </Table>
                        </Row>
                        <Row className="justify-content-center section--title">
                            <Navbar.Text>
                                Movies you may like
                            </Navbar.Text>
                            <i className="uil uil-clapper-board"></i>
                        </Row> 
                        <Row className="movies-section">
                            {
                                this.state.show&&
                                this.state.moveis.map((value,index)=>{
                                    return(
                                        <Card key={index}>
                                            <Card.Img variant="top" src={value.image} />
                                            <Card.Body>
                                                <Card.Title>
                                                    {value.title}
                                                </Card.Title>
                                                <Card.Text>
                                                    {value.overview}
                                                </Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroupItem><b>Popularity: </b>{value.popularity}</ListGroupItem>
                                                <ListGroupItem><b>Rating: </b>{value.rating}</ListGroupItem>
                                                <ListGroupItem><b>Total Reating: </b>{value.totalReating}</ListGroupItem>
                                                <ListGroupItem><b>Release Date: </b>{value.releaseDate}</ListGroupItem>
                                            </ListGroup>
                                        </Card>
                                    )
                                })
                            }
                            
                        </Row>     
                </Container>
            
            
        )
    }
}
export default City
