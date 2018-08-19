"use strict";
import React from 'react';
import {Image,AsyncStorage,AppRegistry,View} from 'react-native';
import {Button,
		Card,
		CardItem,
		Tab,
		Tabs,
		TabHeading,
		Content,
		Container,
		Text,
		List,
		Header,
		Input,
		ListItem,
		Left,
		Label,
		Item,
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
	
	  this.state = {data:null,
	  isLoading:false,
	  selected: 'key1',
	  selectedProv:9,
	  selectedKabKot:'',
	  kabkota:null,
	  dataCost:null,
	  provinsi:null,
	  itemSelected:'',
	  active: false,
	  dataTypeCourier:'',
	  storeData:null,
	  storeDataParse:null};
	}
	componentWillMount(){
		AsyncStorage.getItem('cart',(err,res) => {
			if (res) {	
				// console.log("=======++++++======")
				// console.log(res);
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
				var sum = 0;
				console.log("=======++++++======")
				console.log(json);
				self.setState({data:JSON.parse(res),isLoading:true});
				
				json.map((item,err) => {
					sum +=item.price;
					console.log(item.price)
				})
				console.log(sum);
			}
		});
		// console.log("+++=====++++====++++====++++=====")
		this.fetchallProvinsi();
	}
	onValueChange(value: string) {
	this.setState({
	  selected: value
	});
	// console.log(value);	
	// this.tampilanShipment(value);
	}

	fetchallProvinsi(){
		return fetch('http://192.168.43.220:8080/demo/allprovinsi')
		.then((response) => response.json())
		.then((data) => {
			this.setState({provinsi:data.rajaongkir.results,isLoading:true});
			// console.log("=======Provinsi======")
			// console.log(data.rajaongkir.results);
		}).catch((error) => {
			console.log(error);
		})
	}
	fetchkabkota(key: string){
		this.setState({selectedProv:key});
		return fetch('http://192.168.43.220:8080/demo/kabkota?id='+key).then((response) => response.json())
		.then((data) => {
			this.setState({kabkota:data.rajaongkir.results})
			// console.log(data.rajaongkir.results)
		}).catch((error) => {
			console.log(error)
		})
	}
	forKabKota(){
		if (this.state.kabkota == null) {
			return (
				<List>
					<ListItem><Text>Pilih Provinsi Terlebih dahulu</Text></ListItem> 
				</List>
			)
		}else{
			let din = this.state.kabkota.map((item,key) => {

				return (
					<Picker.Item key={key} value={item.city_id} label={item.city_name} />
				)
			})

			return(
				<Picker
					mode="dropdown"
					style={{width: undefined}}
					placeholder="Provinsi"
					placeholderStyle={{ color: "#bfc6ea" }}
					placeholderIconColor="#007aff"
					selectedValue={this.state.selectedKabKot}
					onValueChange={this.getForCost.bind(this)}
					>
					{din}
				</Picker>
			)

		}
	}
	getForCost(key: string){
		this.setState({selectedKabKot:key})
		return fetch('http://192.168.43.220:8080/demo/getcost?city_id=23&destination='+key+'&provinsi_id=9').then((response) => response.json())
		.then((data) => {
			let dat = [];
			this.setState({dataCost:data.rajaongkir.results,dataTypeCourier:data.rajaongkir.results.code})
				console.log(data.rajaongkir.results[0].costs)
		}).catch((error) => {
			console.log(error)
		})

	}
	templateCosts(){
		if (this.state.dataCost == null) {
			return (
				<List>
					<ListItem><Text>Pilih Kabupaten/Kota !!!</Text></ListItem>
				</List>
			)
		}else{

			let costs = this.state.dataCost.map((item,key) => {
				console.log("========key========")
				console.log(key);
				for (var i = 0; i < Object.keys(item.costs).length; i++) {
				return (
					<ListItem key={i}>
			            <Left>
			              <Text>{item.costs[i]['service']}</Text>
			            </Left>
			            	<Text>Rp.{item.costs[i].cost[0].value}</Text>
			            <Right>
			              <Radio
			                color={"#f0ad4e"}
			                selectedColor={"#5cb85c"}
			                // onPress={() => console.log(item.service)}
			                // selected={this.state.itemSelected == 'ss'}
			              />
			            </Right>
			        </ListItem>
				)
				}
			})
			return (
				<List>
	        	{costs}
	        	</List>  
			)

		}
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
					<Content>
			          <ListItem>
			            <Left>
			              <Text>POS Express</Text>
			            </Left>
						<Text>Rp.32100</Text>
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
			              <Text>POS Kilat</Text>
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
			          </Content>
				)
			}else{
				return(
					<Text>Ini Paket TIKI</Text>
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

	forProv(){

		if (this.state.provinsi == null) {
			return (
				<List>
				<ListItem>
				<Text>Tidak Ada data</Text>
				</ListItem>
				</List>
			)
		}else{
			let data = this.state.provinsi.map((item,key) =>  {
					return (
		              <Picker.Item key={key} label={item.province} value={item.province_id} />
		            )
			})
			return(
				<Picker
					mode="dropdown"
					style={{width: undefined}}
					placeholder="Provinsi"
					placeholderStyle={{ color: "#bfc6ea" }}
					placeholderIconColor="#007aff"
					selectedValue={this.state.selectedProv}
					onValueChange={this.fetchkabkota.bind(this)}
					>
					{data}
				</Picker>
			)
		}
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
								{this.forProv()}
								{this.forKabKota()}
								<Item inlineLabel>
					              <Label>Alamat</Label>
					              <Input />
					            </Item>
					            <Item inlineLabel last>
					              <Label>Nomor HP</Label>
					              <Input />
					            </Item>

					        </Form>
					        {
						        this.templateCosts()
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