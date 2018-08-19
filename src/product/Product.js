import React from 'react';
import {TextInput,
	Text,
	View,
	Image,
	StatusBarIOS,
	ListView,
	Animated,
	TouchableOpacity,
	ScrollView,
	Platform,
	Dimensions,
	NetInfo,
	DeviceEventEmitter, FlatList,AsyncStorage,ToastAndroid} from 'react-native';
import {Font,Expo} from 'expo';
import {Container, Header,Content, Footer, FooterTab,List,ListItem,Body, Badge,Card,CardItem,Center, Left,Right, Tabs,Button, Title, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconIonic from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-overlay';
import Api from '../WooCommerce/Api';
import Config from '../WooCommerce/Config';
import WooCommerceAPI from '../WooCommerce/WooCommerceAPI';
import product from "../styles/product";
import css from "../styles/style";
// import ProductItems from "./ProductItems";
import Cart from '../cart/Cart';
import Detail from './Detail';
import {createStackNavigator} from "react-navigation";

var offset = 0;
var offsetHeader = 100;
var beta = 50;
export default class Product extends React.Component {

 static navigationOptions = {
    headerStyle: {
      backgroundColor: '#74b9ff',
    },
    headerTitle: 'List Product',
    headerRight: (
        <Button transparent style={{marginTop: 5,marginRight: 20}} onPress={() => {console.log(this.props)}}>
        	<IconIonic name="md-cart" style={{fontSize: 24,color: 'white'}} />
        	<Badge>
        		<Text style={{fontSize: 14,color: 'white'}}>5</Text>
        	</Badge>
        </Button>
    ),
  };
	constructor(props) {
	  super(props);
	  this.state = {
	  	isLoading:true,
	  	data:null,
	  	ujang:"Dindi",
	  	page:1,
	  	limit:2,
	  	isOnline:true,
	  	finish:false,
	  	visible:false,
	  	cartItems:[],
	  	countCart:''
	  };
	}


  async addCart(data){
  	var cart = await AsyncStorage.getItem('cart');
  	// var cart = this.state.cartItem;

  	// console.log("------------------")
  	// console.log(cart)
  	// console.log("------------------")

  	var product = data;

  	try{
  		if (cart == null) {
  			AsyncStorage.setItem('cart',JSON.stringify([product]));


  			AsyncStorage.getItem('cart',(err,res) => {
  				this.setState({countCart:Object.keys(JSON.parse(res)).length})
  				console.log(Object.keys(JSON.parse(res)).length)
  			})
  			console.log("Data Tersimpan");
  		}else{
  			
  			var items = JSON.parse(cart)
			let sesaat = this.state.cartItems
			let qty = {qty:10}
			let remove = {"image":data.image,"name":data.name}
  			items.push(product)

			var isEqual = function(o1, o2) {
			    return o1 === o2 || 
			        (o1 != null && o2 != null && 
			         o1.value === o2.value &&
			         o1.label === o2.label);
			};

			var found = false;
			var i;
			for(i = 0; i < Object.keys(this.state.cartItems).length; ++i) {
			    // if(isEqual(arr[i], remove)) {
		    	if (sesaat[i].name == remove.name) {
			        found = true;

			        break;
			    }else{
			    	console.log("Tidak Sama !")
			    }
			}

			if(found) {
			    var forPush = {name:remove.name,image:remove.image,qty:20}
			    sesaat.splice(i, 1);
			    sesaat.push(forPush)

			    AsyncStorage.setItem('cart',JSON.stringify(sesaat));

			    console.log(sesaat);
			    
			}else{
	  			AsyncStorage.setItem('cart',JSON.stringify(items));
  				console.log("Belum Ada");
			}

  			AsyncStorage.getItem('cart',(err,res) => {
  				this.setState({countCart:Object.keys(JSON.parse(res)).length})
  				// console.log(Object.keys(JSON.parse(res)).length)
  			})
  		}
  		ToastAndroid.showWithGravity('Barang Berhasil ditambahkan kedalam cart', 10,ToastAndroid.BOTTOM);
  	}catch(error){
  		console.log(error);
  	}	
  }
	componentDidMount()
	{
		this.fetchdatas();
		setInterval(() => {
	      this.setState({
	        visible: !this.state.visible
	      });
	    }, 3000);

	  	AsyncStorage.getItem("cart", (err, res) => {
	      if (!res){
			 this.setState({cartItems: []})
	      }else{
		       this.setState({cartItems: JSON.parse(res),countCart:Object.keys(JSON.parse(res)).length});
		       console.log("----------")
		       console.log(res)} 
	    });
	}
	componentWillMount()
	{
	  	AsyncStorage.getItem("cart", (err, res) => {
	      if (!res){
			 this.setState({cartItems: []});
	      }else{
		       this.setState({cartItems: JSON.parse(res),countCart:Object.keys(JSON.parse(res)).length});
		       console.log("----------");
		       console.log(res);
		   }
	    });
	}
	fetchdatas()
	{
		var self = this;
		Api.get('products',{
			per_page:10,
			page:2
		}).then(function(result){
			self.setState({
				data:result,
				isLoading:true,
			})
		})
		.catch((error) => {
			console.log(error);
		})
	}
	render() {
		if (this.state.isLoading) {
			if (this.state.data == null) {
				return (
			      <View style={{ flex: 1 }}>
			        <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
			      </View>
			    );
			}else{

					let datanya = this.state.data.map((val,key) => {
						let dat = {
		                  	name:val.name,
		                  	image:val.images[0].src,
		                  	price:val.pirce,
		                  	qty:1
						}
						return( 
							   <List key={key}>
					            <ListItem thumbnail onPress={() => {this.props.navigation.navigate("Detail",{
					                  	title:val.name,
					                  	image:val.images[0].src,
					                  	price:val.pirce,
					                  	desc:val.description,
					                  });
					              	}}>
					              <Left>
					                <Thumbnail square source={{uri:val.images[0].src}} />
					              </Left>
					              <Body>
					                <Text>{val.name}{val.categories[0].name}</Text>
					                <Text note numberOfLines={key}>{val.weight}.</Text>
					              </Body>
					              <Right>
					                <Button transparent>
					                  <Button transparent onPress={this.addCart.bind(this,dat)}>
					                  	<IconIonic name="md-cart" style={{fontSize: 20,color: '#74b9ff'}} />
					                  </Button>
					                </Button>
					              </Right>
					            </ListItem>
					          </List>
						);
					});
			return(
			<View style={product.color}>
			<Container>
				<Content>
					{datanya}
				</Content>
	            <Footer>

	                <FooterTab style={{backgroundColor: '#74b9ff'}}>
	                  <Button vertical onPress={() => this.props.navigation.navigate('Home')}>
	                    <Icon name="home" style={{color: '#dfe6e9',fontSize: 20}}  />
	                    <Text style={{color: '#dfe6e9'}}>Home</Text>
	                  </Button>
	                  <Button vertical onPress={() => this.props.navigation.navigate('Product')}>
	                    <Icon name="shopping-basket" style={{color: '#dfe6e9',fontSize: 20}} />
	                    <Text style={{color: '#dfe6e9'}}>Product</Text>
	                  </Button>

	                  <Button vertical>
	                    <Icon active name="favorite" style={{color: '#dfe6e9',fontSize: 20}}  />
	                    <Text style={{color: '#dfe6e9'}}>Favorite</Text>
	                  </Button>
	                  <Button vertical>
	                    <Icon name="feedback" style={{color: '#dfe6e9',fontSize: 20}} />
	                    <Text style={{color: '#dfe6e9'}}>Feed Back</Text>
	                  </Button>
	                </FooterTab>
	            </Footer>

			</Container>
			</View>

			);
			}
		}else{
			return(
				<View>
					<Text>Dindi</Text>
				</View>
			)
		}
	}
}