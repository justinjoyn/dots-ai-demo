import _ from 'lodash';
import React, { Component } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            weights: this.generateRandomWeights(),
            pointCount: '100',
            trainingCount: '100'
        };
        this.generatePoints = this.generatePoints.bind(this);
        this.generateRandomWeights = this.generateRandomWeights.bind(this);
        this.train = this.train.bind(this);
        this.getTrainedWeights = this.getTrainedWeights.bind(this);
    }

    componentDidMount() {
        this.generatePoints();
    }

    generateRandomPoint() {
        return {
            x: _.random(0, width),
            y: _.random(0, width)
        };
    }

    generateRandomPoints() {
        const count = parseInt(this.state.trainingCount);
        return _.times(count, this.generateRandomPoint);
    }

    generatePoints() {
        const count = parseInt(this.state.pointCount);
        let points = _.times(count, this.generateRandomPoint);
        this.setState({
            points: points
        });
    }

    generateRandomWeights() {
        let randomWeights = {
            x: _.random(-1.000000000000001, 1.000000000000001),
            y: _.random(-1.000000000000001, 1.000000000000001)
        };
        return randomWeights;
    }

    getTeam(point) {
        return point.x > point.y ? 1 : -1;
    }

    guessTeam(weights, point) {
        const sum = point.x * weights.x + point.y * weights.y;
        const team = sum > 0 ? 1 : -1;
        return team;
    }

    train(weights, point, actualTeam) {
        const guessedTeam = this.guessTeam(weights, point);
        const error = actualTeam - guessedTeam;  Guessed Team: ${guessedTeam}    Error: ${error}`);
        const learningRate = 0.01;
        return {
            x: weights.x + point.x * error * learningRate,
            y: weights.y + point.y * error * learningRate
        };
    }

    getTrainedWeights() {
        const samples = this.generateRandomPoints().map(point => ({
            point,
            team: this.getTeam(point)
        }));
        let currentWeights = this.state.weights;
        for (const sample of samples) {
            currentWeights = this.train(currentWeights, sample.point, sample.team);
        }
        this.setState({
            weights: currentWeights
        });
        console.log(`Trained Weights   X: ${currentWeights.x}   Y: ${currentWeights.y}`);
    }

    render() {
        const { points, weights, pointCount, trainingCount } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
                <Svg height={width} width={width}>
                    {points.map(point => (
                        <Circle
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill={this.guessTeam(weights, point) === -1 ? 'red' : 'blue'}
                            key={`point_${point.x}_${point.y}`}
                        />
                    ))}
                    <Line x1="0" y1="0" x2={width} y2={width} stroke="black" strokeWidth="1" />
                </Svg>
                <View style={styles.controlsView}>
                    <TextInput onChangeText={text => this.setState({ pointCount: text })} value={pointCount} />
                    <TouchableHighlight onPress={this.generatePoints} style={styles.button}>
                        <Text>Generate Points</Text>
                    </TouchableHighlight>
                    <TextInput onChangeText={text => this.setState({ trainingCount: text })} value={trainingCount} />
                    <TouchableHighlight onPress={this.getTrainedWeights} style={styles.button}>
                        <Text>Train</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    controlsView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#F0F0F0'
    },
    button: {
        padding: 10
    }
});
