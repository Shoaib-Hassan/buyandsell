import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  Dimensions,
  StatusBar,

} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Swiper from 'react-native-swiper';

const screenWidth = Dimensions.get('window').width;


const ImageGallery = ({postImages}) => {
  const [currentIndex, setCurrentIndex] = useState(0);


 

 
function convertToDirectImageLinks(postImages) {
  const images = postImages.map((postImages) => {
    const fileId = postImages.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/)[1];
    const image = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return image;
  });
  return images;
}
  const images = convertToDirectImageLinks(postImages)
 

  return (
    <View style={{ flex: 1, width: screenWidth }}>
      <StatusBar
        backgroundColor="black" // Set your desired background color
        barStyle="light-content" // You can adjust the text color based on your background
      />

      <Swiper showsButtons dotColor='white' activeDotColor='orange' nextButton={<Image source={require('../assets/next.png')} style={{ width: 40, height: 40, }} />} prevButton={<Image source={require('../assets/prev.png')} style={{ width: 40, height: 40 }} />}  >

        {images.map((image) => (
           
           <ImageZoom cropWidth={screenWidth} key={currentIndex}
            cropHeight={200}
            imageWidth={screenWidth}
            imageHeight={200}>
            <Image
            key={currentIndex}
              source={{uri: image}}
              style={{ width: screenWidth, height: 200 }}
            />
         
          </ImageZoom>
          
        ))}

      </Swiper>

    </View>
  );
};

export default ImageGallery;
