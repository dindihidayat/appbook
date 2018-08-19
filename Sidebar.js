import React from "react";
import { AppRegistry, Image,ImageBackground, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
const routes = ["Home", "Chat", "Profile"];
export default class SideBar extends React.Component {
  render() {
    return (
      <Container>
      <LinearGradient colors={['#00cec9','#74b9ff']}>
        <Content style={{backgroundColor: '#74b9ff'}}>
          <ImageBackground
            source={{
              uri: "https://www.pixelstalk.net/wp-content/uploads/2016/11/Download-Images-Flat-Design.jpg"
            }}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Image
              square
              style={{ height: 80, width: 70 }}
              source={{
                uri: "https://png.icons8.com/ios/1600/user-male-circle-filled.png"
              }}
            />
          </ImageBackground>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data)}>
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
        </LinearGradient>
      </Container>
    );
  }
}