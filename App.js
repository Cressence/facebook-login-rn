/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View
} from 'react-native';
import FBSDK, { LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';

class App extends Component {

  facebookAuth = () => {
    LoginManager.logInWithPermissions(['public_profile'])
      .then((result) => {
        if (result.isCancelled) {
          console.log('login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            let accessToken = data.accessToken;
            let facebookId = data.userID;

            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log(error)
                alert('Error fetching data: ' + error.toString());
              } else {
                let user = {
                  token: accessToken.toString(),
                  name: result.name,
                  picture: result.picture.data.url,
                  providerId: facebookId
                }
                alert(JSON.stringify(user ));
              }
            }

            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: 'name,picture'
                  }
                }
              },
              responseInfoCallback
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      }, function (error) {
        console.log('An error occured: ' + error);
      });
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.facebookAuth} style={[styles.btn, { backgroundColor: '#4267B2' }]} >
          <Text style={{ color: '#ffffff', alignSelf: "center"}}>Sign in with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  btn: {
    width: 250,
    height: 41,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 2
  }
});

export default App;
