"use strict";
import React from 'react';
import { Expo,Font } from 'expo';
import {AppRegistry,Image,View,AsyncStorage } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {Container, Text,Content,Left,Button,Right,Footer,FooterTab,Tabs,Tab,Badge,Card,CardItem,Item,Input, Body,Thumbnail,Toast, List, ListItem, Separator } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import App from '../../App';
import Product from './Product';
import Cart from '../cart/Cart';
import ProductItems from './ProductItems';
export default class Detail extends React.Component {

	constructor(props) {
	  super(props);
		
	  this.state = {name:'',product:{},quantity:1,image:'',pushCart:{},cartItems:[]};
	}
	static navigationOptions = {
    headerTitle: 'Detail',
    headerRight: (
        <Button style={{marginTop: 5,marginRight: 20,backgroundColor: '#74b9ff'}} onPress={() => {console.log(this.props)}}>
        	<Icon name="md-cart" style={{fontSize: 24,color: 'white'}} />
        	<Badge>
        		<Text style={{fontSize: 14}}>5</Text>
        	</Badge>
        </Button>
      // <Icon name="md-cart" style={{color: '#0984e3',fontSize: 24,marginRight: 10,shadowColor: '#2d3436',shadowRadius: 5}} />
    ),
    headerStyle: {
      backgroundColor: '#74b9ff',
    },

  };
  componentWillMount(){
  	var self = this;
  	self.setState({product:dummyProduct});
	const { navigation } = self.props;

	const title = navigation.getParam('title',"NO-ID");
	const image = navigation.getParam('image');
	const price = navigation.getParam('price','0');
  	self.setState({name:title,image:image,price:price});

  	AsyncStorage.getItem("cart", (err, res) => {
      if (!res) this.setState({cartItems: []});
      else this.setState({cartItems: JSON.parse(res)});
    });
  }
  saveKey(value) {
  	var store;
  	var product = this.state.product;
  	var self = this;
    product['color'] = "Red";
    product['size'] = 12;
    product['quantity'] = 1;
    store = AsyncStorage.getItem("cart");
    if (store == null) {
		AsyncStorage.setItem("cart",JSON.stringify([product]));
    }else{
		var items = store;
		items.push(product);
		AsyncStorage.setItem("cart",JSON.stringify(items));
		console.log(items);
    }
	Toast.show({
	    text: 'Product added to your cart !',
        position: 'bottom',
        type: 'success',
        buttonText: 'Dismiss',
        duration: 3000});
  }
  async addCart(data){
  	var cart = await AsyncStorage.getItem('cart');
  	var product = data;

  	try{
  		if (cart == null) {
  			AsyncStorage.setItem('cart',JSON.stringify([product]));
  			console.log(product);
  		}else{
  			var items = JSON.parse(cart);
  			items.push(product);
  			this.state.cartItems.map((item,i) => {
  				if (data.name == item.name) {
  					var dat = item;
  					console.log("Atas");
  				}else{
		  			AsyncStorage.setItem('cart',JSON.stringify(items));
	  				console.log("Bawah");
  				}
  			});
  		}
  	}catch(error){
  		console.log(error);
  	}	
  }
  hapus = async () => {
  	var cekCart = await AsyncStorage.getItem('cart');
  	try{
  		if (cekCart !=null) {
  			await AsyncStorage.removeItem('cart');
  		}else{
	  		alert("you cannot remove this item");
  		}
  	}catch(error){
		alert("Empty Data");
  	}
  	AsyncStorage.removeItem('user');	
  }
  displayData = async () => {
  	let data = [];
  	await AsyncStorage.getItem('cart', (err, res) => {
      if (res !==null){
      	data = res;
      	this.state.cartItems.map((item,i) => {
      		console.log(item.name);
      	});
      }else{alert(err)} ;
    });

  }

	render() {

		let parsing = {
			name:this.state.name,
			image:this.state.image,
			price:this.state.price,
			qty:1,	
		}
		let desc = this.props.navigation.getParam('desc') ? this.props.navigation.getParam('desc') :"Tidak Ada Deskripsi !";
		return (
			<Container>

				<Content>
		          <Card style={{flex: 0}}>
		            <CardItem style={{borderColor: '#dfe6e9',borderStyle: 'dotted',borderWidth: 2}}>
		              <Body>
							<Image source={{uri:this.props.navigation.getParam('image')}} style={{width: 200, height: 250,flex: 1}} />
		                <Text>
		                  {parsing.name}
		                </Text>
		              </Body>
		            </CardItem>
		            <CardItem style={{borderColor: '#dfe6e9',borderStyle: 'dotted',borderWidth: 2}}>
		              <Left>
		                <Button primary style={{width: 50}}>
		                	<Icon name="md-add" style={{fontSize: 24,color: 'white',marginLeft:15}} />
		                </Button>
				          <Item regular style={{width: 100,height: 48}}>
				            <Input placeholder='QTY'/>
				          </Item>
		                <Button warning style={{width: 50}}>
		                	<Icon name="md-remove" style={{fontSize: 24,color: 'white',marginLeft:15}} />
		                </Button>

		              </Left>
		            </CardItem>
		          </Card>
		          <Card>
		          	<CardItem>
		                <Button primary style={{width: 50}} onPress={this.addCart.bind(this,parsing)}>
		                	<Icon name="md-cart" style={{fontSize: 24,color: 'white',marginLeft:15}} />
		                </Button>
		                <Button info style={{width: 50}} onPress={this.displayData.bind(this)}>
		                	<Icon name="md-heart" style={{fontSize: 24,color: 'white',marginLeft:15}} />
		                </Button>
		          	</CardItem>

		          	<CardItem>
				        <Tabs style={{backgroundColor: '#74b9ff'}}>
				          <Tab heading="Description">
				            <Text>{desc}</Text>
				          </Tab>
				          <Tab heading="Detail">
					        <Content>
					          <Separator bordered>
					            <Text>Payment</Text>
					          </Separator>
					          <ListItem>
					            <Text>COD</Text>
					          </ListItem>
					          <ListItem last>
					            <Text>Transfer</Text>
					          </ListItem>
					          <Separator bordered>
					            <Text>Courier Avalible</Text>
					          </Separator>
					          <ListItem>
					            <Text>JNE</Text>
					          </ListItem>
					          <ListItem last>
					            <Text>POS</Text>
					          </ListItem>
					        </Content>
				          </Tab>
				        </Tabs>
		          	</CardItem>
		          </Card>
		        </Content>
			</Container>
		)
	}
}

const dummyProduct = {
  id: 2,
  title: 'V NECK T-SHIRT',
  price: '120$',
  qty:1
};