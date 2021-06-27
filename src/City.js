import axios from 'axios';
import React, { Component } from 'react'
import { Container,Row,Col,Form,Button, Table} from 'react-bootstrap'

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
            show:false
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
        console.log(axiosResData);
       
        this.setState({
            show:true,
            location:axiosResData.data[0].display_name,
            latitude:axiosResData.data[0].lat,
            longitude:axiosResData.data[0].lon,
            error:""
            
            
        })
        
        let map=await axios.get(`https://maps.locationiq.com/v3/staticmap?key=pk.b848c1ee9a6d10f565222020b02495f1&center=${this.state.latitude},${this.state.longitude}&zoom=10`);
        this.setState({
            mapImg:map.config.url
            
        })
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
            <section>
                <Container>
                    <Row>
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
                        { this.state.show&&
                            <Table striped bordered hover variant="dark">
                        <thead>
                            <th>Location</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
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
                                    <img src={this.state.mapImg} alt={this.state.location?this.state.location.length>0:'.'} className='map-img'></img>
                            </tr>
                        </tbody> 
                        </Table>
                        }
                        </Row>
                        
                </Container>
            </section>
        )
    }
}

export default City
