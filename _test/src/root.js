// Info: Project Root
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// React (Private Scope)
import React, {useEffect, useState} from 'react';

// React Native Base Component (Private Scope)
import { ActivityIndicator, Text, View, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// BackgroundService Provider (Private Scope)
//const useBackgroundRefresh = require('./rn-helper-background-refresh/backgroundRefresh')();



var COUNT = 0


/////////////////////////// Module-Loader START ////////////////////////////////
/********************************************************************
Load dependencies and Configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules

Return - None
*********************************************************************/
const loader = function(shared_libs){

  // Shared Dependencies (Managed by Main Entry Module)
  Lib = shared_libs;


};/////////////////////////// Module-Loader END ////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs){

  // Load loader
  loader(shared_libs);

  // Export Public Interfaces of this module
  return Root;

};//////////////////////////// Module Exports END //////////////////////////////



//////////////////////////////// Component START ///////////////////////////////
const Root = function(){


  const [progress, setProgress] = useState(0);
  const [progress_count, set_progress_count] = useState(
    {
      count: 0,
      total_count: 10
    }
  );

  const asd = function(asd){
    console.log('demo111', asd);
  }

  var data = [
    {
      callback: ()=> asd('demo111'),
      interval: 1000
    },
    {
      callback: ()=> console.log('demo222'),
      interval: 5000
    }
  ]

  //const backgroundRefreshActions = useBackgroundRefresh(data, true);


  useEffect(()=>{
    //backgroundRefreshActions.stop(1);
  },[]);

    // var urls =[
    //   'https://placehold.co/622x450/000000/FFFFFF.png',
    //   'https://placehold.co/622x487/222222/FFFFFF.png',
    //   'https://placehold.co/621x402/444444/FFFFFF.png',
    //   'https://placehold.co/621x401/666666/FFFFFF.png',
    //   'https://placehold.co/621x406/888888/FFFFFF.png',
    //   //'ttps://placehold.co/600x400/888888/FFFFFF.png',
    //   'https://placehold.coomm/600x400/AAAAAA/FFFFFF.png',
    //   'https://placehold.co/600x407/CCCCCC/FFFFFF.png',
    //   // 'https://placehold.co/600x400/EEEEEE/FFFFFF.png',
    // ]

    //Lib.Cache.postMessageToAddResource('group-v-1', urls, function(){}, function(){})


  useEffect(()=>{
    var urls =[
      //"https://dev-ctp-static.s3.ap-south-1.amazonaws.com/tenant/8az0mf374g6w5qbfnsdz6y2wa/brand/ehctdzsotqmia0wom9666nv85/assembly/1evyiii514zzxoajjquui4nnq/tab/7mqljx5kj4a2k5ejqelvu7vjr.json"
      'https://placehold.co/622x487/222222/FFFFFF.png',
      'https://placehold.co/622x402/444444/FFFFFF.png',
      'https://placehold.co/622x401/666666/FFFFFF.png',
      'https://placehold.co/622x406/888888/FFFFFF.png',
      'https://placehold.co/600x407/CCCCCC/FFFFFF.png',
      'https://placehold.co/600x400/EEEEEE/FFFFFF.png',
    ]

  Lib.Cache.clearAllCache(function(){})

      // Lib.Cache.processResourceList(
      // function(err){
      //   // if(err){
      //   //   console.log('dafadsf', err);
      //   // }
      //   // else{
      //   //   console.log('Download Completed');
      //   // }
      //
      // },
      // function(count, total_count){
      //   // set_progress_count(()=>{
      //   //   return {
      //   //     count: count,
      //   //     total_count: total_count
      //   //   }
      //   // })
      // },
      // 'group-9',
      // urls
      // )

  //  Lib.Cache.getFileFromCache(
  //     function(res){
  //       console.log('testingg res', res);
  //     },
  //     'group-7',
  //     'https://placehold.co/622x401/666666/FFFFFF.png',
  //     null
  //     )


// //     var cache_data = {
// //       name:'anand'
// //     }

// //  // Set key value in async storage
// //   AsyncStorage.setItem('test1',JSON.stringify(cache_data), function(err){

// //     console.log(err);

// //   });
// //     AsyncStorage.getItem('test1', function(err, value) {

// //       console.log('value',JSON.parse(JSON.stringify(value)));

// //     });


// //     AsyncStorage.getAllKeys(function(err, keys){

// //       console.log('key', keys);
// //     })

//     //Lib.Cache.clearCache('group3', function(){})
  },[])

  const AppComponent = function(){

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text>Progress Screen</Text>
        <Text>{progress} / {progress_count.total_count}</Text>
        <View
          style={{
            width: '80%',
           height: '100%',
            backgroundColor: '#EEEEEE',
            //borderRadius: 10,
            //overflow: 'hidden',
          }}
        >
          <View
            style={{
               //width: `${(progress/progress_count.total_count) * 100}%` ,
               height: '100%',
              backgroundColor: '#6200EE'
              }}
            >

          <Image
            source={{uri:'https://placehold.co/600x407/CCCCCC/FFFFFF.png'} }
            style = {{height: 200, width: 200}}
          />

          </View>

        </View>
      </View>
    );
  }



  return (
    <AppComponent/>
  );

};/////////////////////////////// Component END ////////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Root = { // Private functions accessible within this modules only


};//////////////////////////Private Functions END///////////////////////////////
