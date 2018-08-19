import React from 'react';
import { Font, AppLoading } from 'expo';
import { StyleSheet, Text, View,Image,AsyncStorage } from 'react-native';
import { createStackNavigator,DrawerNavigator } from 'react-navigation';
import { Container, Header,Footer,FooterTab, Badge,Left, Body, Right,Tab,Tabs, Button, Title, Thumbnail,Card, Content,CardItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Product from './src/product/Product';
import Detail from './src/product/Detail';
import Cart from './src/cart/Cart';
import Api from './src/WooCommerce/Api';
import Config from './src/WooCommerce/Config';
import WooCommerceAPI from './src/WooCommerce/WooCommerceAPI';
import Spinner from 'react-native-loading-overlay';
import HeaderTemplate from './src/template/HeaderTemplate';
import Sidebar from './Sidebar';
class HomeScreen extends React.Component {

constructor(props) {
  super(props);

  this.state = {isLoading:false,data:null,visible:false,countCart:'',param:null};
}
 static navigationOptions = {
    header:null,
    // headerStyle: {
    //   backgroundColor: '#74b9ff',
    // },
    // headerTitle: 'Home',
    // headerRight: (
    //     <Button style={{marginTop: 5,marginRight: 20,backgroundColor: '#74b9ff'}} onPress={() => console.log("Dindi")}>
    //       <Icon name="md-cart" style={{fontSize: 24,color: 'white'}} />
    //       <Badge>
    //         <Text style={{fontSize: 14}}>5</Text>
    //       </Badge>
    //     </Button>
    // ),
  };

  componentWillMount(){
    this.fetchData();
    setInterval(() => {
        this.setState({
          visible: !this.state.visible
        });
      }, 3000);
    var self = this;
    AsyncStorage.getItem('cart',(err,res) => {
      if (!res) {
        console.log(err)
        self.setState({countCart:0});
      }else{
        var json = JSON.parse(res);
        console.log(Object.keys(json).length);
        self.setState({countCart:Object.keys(json).length,param:res});
      }
    });

    this.fetchDataApi();
  }
  componentDidMount(){
    var self = this;
    this.fetchDataApi();
    AsyncStorage.getItem('cart',(err,res) => {
      if (!res) {
        console.log(err)
        self.setState({countCart:0});
      }else{
        var json = JSON.parse(res);
        console.log(Object.keys(json).length);
        self.setState({countCart:Object.keys(json).length,param:res});
      }
    });
  }
  fetchData(){
    var self = this;
    Api.get("products/categories",{
      per_page:10,
      page:1
    }).then(function(result){
      // console.log(result);
      self.setState({data:result,isLoading:true})
    }).catch((error) => {
      console.log(error)
    })
  }

  fetchDataApi(){
   return fetch('http://10.18.103.131:8080/demo/getcost')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("=====+++====")
        console.log(responseJson.rajaongkir);
        this.setState({
          isLoading: false,
          dataSource: responseJson.rajaongkir,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  loadData(){
      if (this.state.data == null) {
        return (
            <View style={{ flex: 1 }}>
              <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
            </View>
        )
      }else{
        let datana = this.state.data.map((res,key) => {
          let forParam = {
            name:res.name,
            description:res.description,
            slug:res.slug,
          }

          return(
              <Card key={key} style={{flex:1,justifyContent: 'center',paddingLeft: 10,paddingRight: 10}}>
                <CardItem cardBody style={{flex:1,paddingTop: 10,paddingBottom: 10}}>
                  <Image source={{uri:"http://www.itbpress.itb.ac.id/wp-content/uploads/2018/03/buku4b.jpg"}} blurRadius={2} style={{height: 200, width: "100%", flex: 1,backgroundColor: '#ccc',flex: 1,position: 'absolute', justifyContent: 'center'}} />
                  <Text style={{marginLeft: 55,backgroundColor: 'transparent',textAlign: 'center',fontSize: 30,padding: 40,color: 'white',fontWeight: '900', justifyContent: 'center' }}>{res.name.toUpperCase()}</Text>
                </CardItem>
              </Card>
          )
        });
        return (
            <Container>
                <HeaderTemplate {...this.props}/>
                <Content>
                    {datana}
                </Content>
                <Footer>
                    <FooterTab style={{backgroundColor: '#74b9ff'}}>
                      <Button vertical onPress={() => this.props.navigation.navigate('Home')}>
                        <Icon name="md-home" style={{color: '#dfe6e9',fontSize: 20}}  />
                        <Text style={{color: '#dfe6e9'}}>Home</Text>
                      </Button>
                      <Button vertical onPress={() => this.props.navigation.navigate('Product')}>
                        <Icon name="md-book" style={{color: '#dfe6e9',fontSize: 20}} />
                        <Text style={{color: '#dfe6e9'}}>Product</Text>
                      </Button>

                      <Button vertical>
                        <Icon active name="md-heart" style={{color: '#dfe6e9',fontSize: 20}}  />
                        <Text style={{color: '#dfe6e9'}}>Favorite</Text>
                      </Button>
                      <Button vertical onPress={() => console.log(this.props.navigation)}>
                        <Icon name="md-paper" style={{color: '#dfe6e9',fontSize: 20}} />
                        <Text style={{color: '#dfe6e9'}}>Feed Back</Text>
                      </Button>
                    </FooterTab>
                </Footer>

            </Container>

        );  
      }


  }
  render() {
    if (this.state.isLoading) {
      return(
        this.loadData()
      );
    }else{
      return(
        <View style={{ flex: 1 }}>
          <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        </View>
      );
    }

  }
}
const AppRoute = DrawerNavigator({
  Home : {screen:HomeScreen},
  Product : {screen:Product},
  Detail : {screen:Detail},
  Cart : {screen:Cart},
},  {
    contentComponent: props => <Sidebar {...props} />
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default class App extends React.Component{
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }
  render() {
    return <AppRoute/>
  }
}