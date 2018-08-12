import React from 'React';
import {AppRegistry,Text} from 'react-native';
import {Footer, FooterTab,Button} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from 'react-navigation';
import App from '../../App';
import Product from '../product/Product';
class FooterTemplate extends React.Component{
	render()
	{
		return (
            <Footer>
                <FooterTab style={{backgroundColor: '#74b9ff'}}>
                  <Button vertical>
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
		)
	}
}
const AppRoute = createStackNavigator({
  Home :App,
  Product:Product,
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
AppRegistry.registerComponent('HomeScreen', () => App);