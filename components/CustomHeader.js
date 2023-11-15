import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const CustomHeader = ({ navigation }) => {
    const useNavigation = navigation()
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => useNavigation.goBack()} style={styles.backButton}>
                <Image style={styles.backButtonIcon} source={require('../assets/back.png')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        marginTop: 5,
        marginLeft: 15, // Adjust the margin as needed
    },
    backButtonIcon: {
        width: 30,
        height: 30
    },

});

export default CustomHeader;
