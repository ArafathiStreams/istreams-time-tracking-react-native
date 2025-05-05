import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

const Logo = () => {
    return (
        <View>
            {/* Logo Image */}
            <Image
                source={require("../../assets/logo_edited.png")}
                style={styles.logoimage}
                resizeMode="center"
            />
        </View>
    );
};

export default Logo;

const styles = StyleSheet.create({
    logoimage: {
        alignSelf: "center",
    }
})
