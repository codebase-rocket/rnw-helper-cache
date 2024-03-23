/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ProgressBarAndroid, ProgressViewIOS, Platform, StyleSheet } from 'react-native';

var Lib;


module.exports = function(lib){

  Lib = lib;
  return App;

}

const App = function(props){

  const [progress, setProgress] = useState(0);
  const [progress_count, set_progress_count] = useState(
    {
      count: 0,
      total_count: 10
    }
  );

  useEffect(()=>{
    var urls =[ 
      'https://placehold.co/620x450/000000/FFFFFF.png',
      'https://placehold.co/620x487/222222/FFFFFF.png',
      'https://placehold.co/620x402/444444/FFFFFF.png',
      'https://placehold.co/620x401/666666/FFFFFF.png',
      'https://placehold.co/620x406/888888/FFFFFF.png',
      // 'ttps://placehold.co/600x400/888888/FFFFFF.png',
      // 'https://placehold.co/600x400/AAAAAA/FFFFFF.png',
      'https://placehold.co/600x407/CCCCCC/FFFFFF.png',
      // 'https://placehold.co/600x400/EEEEEE/FFFFFF.png',
    ]

    Lib.Cache.processResourceList('group3', urls,  
    function(err){
      if(err){
        console.log('dafadsf', err);
      }
      else{
        console.log('Download Completed');
      }  
 
    },
    function(count, total_count){
     set_progress_count(()=>{
      return {
        count: count,
        total_count: total_count
      }
     }) 
    },

    
    )


    //Lib.Cache.clearCache('group3', function(){})
  },[])

  


  useEffect(() => {

    // if(progress_count < 10){

    //   setTimeout(() => {
    //     set_progress_count(progress_count+1)

    //   }, 2000);
    // }
    
  }, [progress_count]);

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
      <Text>{progress_count.count} / {progress_count.total_count}</Text>
      <View 
        style={{
          width: '80%',
          height: 20,
          backgroundColor: '#EEEEEE',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <View 
          style={{
             width: `${(progress_count.count/progress_count.total_count) * 100}%` ,
             height: '100%',
            backgroundColor: '#6200EE'
            }} 
          />
      </View>
    </View>
  );

}


