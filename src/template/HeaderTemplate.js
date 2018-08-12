import React from 'react'
import {AppRegistry, View, Image, AsyncStorage} from 'react-native'
import { createStackNavigator } from 'react-navigation';
import {Left, Badge, Right, Header, Container, Text, Title,Button, Content, Body} from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import Cart from '../cart/Cart';
import App from '../../App';

export default class HeaderTemplate extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {countCart:'',param:null};
	}

	componentDidMount(){
		var self = this;
		AsyncStorage.getItem('cart',(err,res) => {
			if (res) {
				console.log(Object.keys(JSON.parse(res)).length)
				this.setState({countCart:Object.keys(JSON.parse(res)).length,param:res})
			}
		})
	}
	componentWillMount(){
		AsyncStorage.getItem('cart',(err,res) => {
			if (res) {
				console.log(Object.keys(JSON.parse(res)).length)
				this.setState({countCart:Object.keys(JSON.parse(res)).length,param:res})
			}
		})
	}
	render(){
		return (
			<Header style={{backgroundColor: '#74b9ff'}}>
			  <Left>
			    <Button transparent>
			      <Icon name="md-home" style={{color:'white',fontSize: 24}} />
			    </Button>
			  </Left>
			  <Body>
			    <Title>Header</Title>
			  </Body>
			  <Right> 
			    <Button transparent onPress={() => {this.props.navigation.navigate('Cart',{param:this.state.param})}}>
			      <Icon name="md-cart" style={{color:'white',fontSize: 24}} />
			      <Badge style={{ backgroundColor: '#74b9ff' }}>
			          <Text style={{fontSize: 20,color: 'white',fontWeight: 'bold'}}>{this.state.countCart}</Text>
			      </Badge>
			    </Button>
			  </Right>
			</Header>
		)
	}
}
AppRegistry.registerComponent('HeaderTemplate', () => HeaderTemplate)