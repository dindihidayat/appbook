import React from 'react';
import {View, Text,StyleSheet,TouchableOpacity, Image} from 'react-native';
import css from "../styles/product";
import style from "../styles/style";
import {Button, Left, Right} from "native-base";
import { createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
export default class ProductItems extends React.Component{
    constructor(props) {
      super(props);
    
      this.state = {};
    }
	render(){

		return(

            <TouchableOpacity style={[css.cards]}> 
                <Image source={{uri: this.props.product.images[0].src}} style={css.productItem}></Image>

                <Text style={css.productName}>{this.props.product.name}</Text>

                <View style={{flexDirection:'row'}}>
                	<Left>
	                    <Text style={[css.discountPrice, {paddingBottom: 12}]}>Rp.{this.props.product.price}</Text>
                	</Left>

                	<Right>
	                	<Button vertical style={{width: 100}}>
	                		<Icon name="md-cart" style={{fontSize: 20, color: 'white'}} />
	                	</Button>
                	</Right>
                </View>
            </TouchableOpacity>

		)
	}
}