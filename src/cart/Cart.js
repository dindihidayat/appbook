"use strict";
import React from 'react';
import {Image,AsyncStorage,AppRegistry,View} from 'react-native';
import {Button,
		Card,
		CardItems,
		Tab,
		Tabs,
		TabHeading,
		Content,
		Container,
		Text,
		List,
		Header,
		ListItem,
		Left,
		Body,
		Radio,
		Separator,
		Thumbnail,
		Right, Picker, Form ,Fab
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import App from '../../App';

export default class Cart extends React.Component {
	static navigationOptions = {
		header:null,
	}
	constructor(props) {
	  super(props);
	
	  this.state = {data:null,isLoading:false,selected: 'key1',itemSelected:'',active: false,storeData:null,storeDataParse:null};
	}
	componentWillMount(){
		AsyncStorage.getItem('staticCart',(err,res) => {
			console.log("=====--------Static Cart-------=====")
			if (res) {	
				this.setState({storeData:res})
			}
		})		
	}
	componentDidMount(){
		var self = this;
		AsyncStorage.getItem('cart',(err,res) => {
			if (!res) {
				console.log(err)
				self.setState({isLoading:true});
			}else{
				var json = JSON.parse(res);
				// console.log(json);
				self.setState({data:JSON.parse(res),isLoading:true});
			}
		});
	}
	onValueChange(value: string) {
	this.setState({
	  selected: value
	});
	// console.log(value);	
	// this.tampilanShipment(value);
	}
	async hapusItem(param){
		var self = this;
		await AsyncStorage.getItem('cart',(err,res) => {
			if (!res) {
				console.log(err)
			}else{
				var sesaat = JSON.parse(this.props.navigation.getParam('param'));
				var arr = JSON.parse(res);
				// Store res into local storage (StaticCart)


				// Object to remove from arr
				var remove = {"image":param.image,"name":param.name};

				//Get again and store result to storeData,StoreDataParse 
				// Function to determine if two objects are equal by comparing
				// their value and label properties
				var isEqual = function(o1, o2) {
				    return o1 === o2 || 
				        (o1 != null && o2 != null && 
				         o1.value === o2.value &&
				         o1.label === o2.label);
				};

				// Iterate through array and determine if remove is in arr
				var found = false;
				var i;
				for(i = 0; i < Object.keys(arr).length; ++i) {
				    // if(isEqual(arr[i], remove)) {
			    	if (arr[i].name == remove.name) {
				        found = true;
				        AsyncStorage.removeItem('cart');
				        break;
				    }else{
				    	console.log("Tidak Sama !")
				    }
				}

				if(found) {
				    // Found remove in arr, remove it
				    sesaat.splice(i, 1);
				    AsyncStorage.setItem('cart',JSON.stringify(sesaat))
				    this.setState({data:sesaat})
					// console.log("---------------")

					// console.log("---------------")
				    
				}

			}
		});

	}
	tampilanShipment(){
		let shipment = this.state.selected;
		if (shipment == '') {
			return(
				<Text>Belum Memilih Kurir nya ! </Text>
			)
		}else{
			if (shipment == 'key0') {
				return(
					<Content>
			          <ListItem>
			            <Left>
			              <Text>SS(Super Speed)</Text>
			            </Left>
						<Text>Rp.21000</Text>
			            <Right>
			              <Radio
			                color={"#f0ad4e"}
			                selectedColor={"#5cb85c"}
			                onPress={() => this.setState({itemSelected:'ss'})}
			                selected={this.state.itemSelected == 'ss'}
			              />
			            </Right>
			          </ListItem>
					 <ListItem >
			            <Left>
			              <Text>YES(Yakin Esok Sampai)</Text>
			            </Left>
						<Text>Rp.21000</Text>
			            <Right>
			              <Radio
			                color={"#f0ad4e"}
			                selectedColor={"#5cb85c"}
			                onPress={() => this.setState({itemSelected:'yes'})}
			                selected={this.state.itemSelected == 'yes'}
			              />
			            </Right>
			          </ListItem>
			          <ListItem>
			            <Left>
			              <Text>REG(Regurer)</Text>
			            </Left>
		            	<Text>Rp.21000</Text>
			            <Right>
			              <Radio
			                color={"#f0ad4e"}
			                selectedColor={"#5cb85c"}
			                onPress={() => this.setState({itemSelected:'reg'})}
			                selected={this.state.itemSelected == 'reg'}
			              />
			            </Right>
			          </ListItem>
			          <ListItem>
			            <Left>
			              <Text>OKE(Ongkos Kirim Ekonomis)</Text>
			            </Left>
						<Text>Rp.21000</Text>
			            <Right>
			              <Radio
			                color={"#f0ad4e"}
			                selectedColor={"#5cb85c"}
			                onPress={() => this.setState({itemSelected:'oke'})}
			                selected={this.state.itemSelected == 'oke'}
			              />
			            </Right>
			          </ListItem>
			          </Content>
					)
			}else if(shipment == 'key1'){
				return(
					<Text>{shipment}</Text>
				)
			}
		}
	}
	pos(){
		return(
			<Text>Ini Paket POS</Text>
		)
	}
	jne(){
		return(
		<Content>
		 <ListItem selected={false} >
            <Left>
              <Text>Lunch Break</Text>
            </Left>
            <Right>
              <Radio
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
                selected={false}
              />
            </Right>
          </ListItem>
          <ListItem selected={true}>
            <Left>
              <Text>Discussion with Client</Text>
            </Left>
            <Right>
              <Radio
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
                selected={true}
              />
            </Right>
          </ListItem>
          </Content>
		)
	}
	loadTemplate(){
		var self = this;
		if (self.state.data == null ) {
			return(
				<Text>Tidak Ada Data !</Text>
			)
		}else{
			let daang = self.state.data.map((val,key) => {
				let dataParam = {
					name:val.name,
					image:val.image
				}
				return(
					<ListItem avatar key={key}>
		              <Left>
		                <Thumbnail source={{ uri: val.image }} />
		              </Left>
		              <Body>
		                <Text>{val.name}</Text>
		                <Text note>RP. 23000</Text>
		              </Body>
		              <Right>
		              	<Button transparent onPress={this.hapusItem.bind(this,dataParam)}>
		              		<Icon name="md-trash" style={{color:'red',fontSize: 30}} />
		              	</Button>	
		              </Right>
		            </ListItem>
				);
			});
			return(

				 <List>
		           {daang}
		          </List>

			)
		}


	}
	trash = async () => {
	  	var cekCart = await AsyncStorage.getItem('cart');
	  	var self = this;
	  	try{
	  		if (cekCart !=null) {
	  			await AsyncStorage.removeItem('cart');
	  			self.setState({data:null});
	  		}else{
		  		alert("Cart telah Dihapus");
	  		}
	  	}catch(error){
			alert("Empty Data");
	  	}
	  	AsyncStorage.removeItem('user');	
	  }
	render(){
		if (this.state.isLoading) {
		return(
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigation.navigate('Home')}>
							<Icon name="md-arrow-back" style={{fontSize: 24,color: 'white'}} />
						</Button>
					</Left>
					<Body>
						<Text style={{fontSize: 24,color: 'white'}}>Check Out</Text>
					</Body>
				</Header>

				<Content>
					<Tabs>
						<Tab heading={ <TabHeading><Icon name="md-cart" style={{fontSize: 24,color:'white'}}/><Text> Cart</Text></TabHeading>}>
							{this.loadTemplate()}
						 <View style={{ flex: 1 }}>
				          <Fab
				            active={this.state.active}
				            direction="left"
				            containerStyle={{ }}
				            style={{ backgroundColor: '#5067FF' }}
				            position="bottomRight"
				            onPress={() => this.setState({ active: !this.state.active })}>
				            <Icon name="md-more" style={{color: 'white',fontSize: 20}} />
				            <Button style={{ backgroundColor: '#34A34F' }}>
				              <Icon name="md-add" style={{color: 'white',fontSize: 14}} />
				            </Button>
				            <Button style={{ backgroundColor: '#e74c3c' }} onPress={this.trash.bind(this)}>
				              <Icon name="md-trash" style={{color: 'white',fontSize: 14}} />
				            </Button>
				          </Fab>
				        </View>
						</Tab>
						<Tab heading={ <TabHeading><Icon name="md-boat" style={{fontSize: 24,color:'white'}}/><Text> Shipment</Text></TabHeading>}>
							<Form>
					            <Picker
					              mode="dropdown"
					              iosHeader="Select Courier"
					              iosIcon={<Icon name="ios-arrow-down-outline" />}
					              style={{ width: undefined }}
					              selectedValue={this.state.selected}
					              onValueChange={this.onValueChange.bind(this)}
					            >
					              <Picker.Item label="JNE" value="key0" />
					              <Picker.Item label="POS" value="key1" />
					              <Picker.Item label="TIKI" value="key2" />
					            </Picker>
					        </Form>
					        {
						        this.tampilanShipment()
					        }
						</Tab>
						<Tab heading={<TabHeading><Icon name="md-cash" style={{fontSize: 24,color:'white'}}/><Text> Payment</Text></TabHeading>}>
							<Text>Cart</Text>
						</Tab>
					</Tabs>
				</Content>
			</Container>
		)
			
		}else{

			return(
				<View>
					 <Text>Data sedang Diload</Text>
				</View>
			);
		}

	}
}

AppRegistry.registerComponent("Cart", () => Cart)