import React, { useState } from 'react';
import { View, Text, ImageBackground, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const carouselData = [
    {
        title: 'PROJECT MANAGEMENT',
        description: 'Enable seamless planning, execution, and monitoring of projects with real-time task tracking, resource allocation, and milestone management to drive timely and cost-effective delivery.',
        image: require('../../assets/project_management.jpg'),
    },
    {
        title: 'PRODUCTION',
        description: 'Streamline and control end-to-end production workflows with automated scheduling, inventory integration, and real-time output tracking to optimize efficiency and minimize downtime.',
        image: require('../../assets/production_banner.jpg'),
    },
    {
        title: 'HRMS & PAYROLL',
        description: 'Automates and manages employee information, attendance, payroll processing, streamlining HR tasks for efficient workforce management.',
        image: require('../../assets/hr_banner.jpg'),
    },
    {
        title: 'MATERIAL MANAGEMENT',
        description: 'Streamline end-to-end material workflows through integrated procurement, inventory control, and consumption tracking modules, ensuring real-time visibility and operational efficiency.',
        image: require('../../assets/material_banner.jpg'),
    },
];

const HomeCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                loop
                width={width * 0.95}
                height={200}
                autoPlay={true}
                data={carouselData}
                autoPlayInterval={1200}
                scrollAnimationDuration={1200}
                onSnapToItem={index => setCurrentIndex(index)}
                renderItem={({ item, index }) => (
                    <ImageBackground source={item.image} style={styles.slide} imageStyle={styles.image}>
                        <View style={styles.overlay}>
                            <Text style={[styles.title, index === 0 && styles.mainTitle]}>{item.title}</Text>
                            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                        </View>

                        {/* Dot Indicators Inside Carousel */}
                        <View style={styles.dotsContainer}>
                            {carouselData.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        i === currentIndex ?styles.dotInactive : styles.dotActive ,
                                    ]}
                                />
                            ))}
                        </View>
                    </ImageBackground>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'flex-end',
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        borderRadius: 16,
        resizeMode: 'stretch',
    },
    overlay: {
        padding: 10,
        margin: 10,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6
    },
    description: {
        color: '#eee',
        fontSize: 14,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotInactive: {
        backgroundColor: '#f3f5f4',
    },
    dotActive: {
        backgroundColor: '#878a89',
        width: 10,
        height: 10,
    },
});

export default HomeCarousel;