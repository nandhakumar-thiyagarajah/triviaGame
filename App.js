import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity, Alert
} from 'react-native';

const API_ENDPOINT = `https://jservice.io/api/random`;

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userInput, setUserInput] = useState("")
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getQuestion();
    }, []);

    const getQuestion = () => {
        fetch(API_ENDPOINT)
            .then(response => response.json())
            .then(results => {
                setSubmitted(false);
                setData(results);
                setUserInput("");
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err);
            });
    };

    const showAlert = () => {
        setSubmitted(true);

        // To avoid blank space used here trim function
        let checkInputLength = userInput.trim();

        if (checkInputLength.length === 0) return;

        // few Answer comes with html tag that's why using here html tag pattern to avaoid this
        let resultMsg = userInput.toLowerCase() === data[0].answer.replace(/(<([^>]+)>)/ig, '').toLowerCase() ? 'Your Answer is Correct...Move on Next Question' : 'Incorrect Answer..Answer is : "' + data[0].answer.replace(/(<([^>]+)>)/ig, '') + '"..Move on Next Question';
        Alert.alert(
            "Result",
            resultMsg,
            [
                { text: "OK", onPress: () => getQuestion() }
            ]
        )
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#5500dc" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>
                    Error fetching data... Check your network connection!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.text}>Quiz Test</Text>
            <View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
                <FlatList
                    contentContainer={{ flex: 1 }}
                    data={data}
                    keyExtractor={item => item.first}
                    renderItem={({ item, index }) => (
                        <View style={styles.listItem}>
                            <View style={styles.metaInfo}>
                                <Text style={styles.title}>{item.question}</Text>
                            </View>
                        </View>
                    )}
                    extraDate={data}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Please Enter your Answer here..."
                    onChangeText={text => setUserInput(text)}
                    underlineColorAndroid={'black'}
                    value={userInput}
                />

                {
                    submitted && userInput.length === 0 && <Text style={styles.errorMsg}>Answer is required field</Text>
                }

            </View>

            <View style={styles.footerButton}>
                <TouchableOpacity onPress={() => showAlert()} style={styles.buttonStyles}>
                    <Text style={{ color: 'white' }}>SUBMIT YOUR ANSWER</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        color: '#101010',
        marginTop: 60,
        fontWeight: '700',
        textAlign: 'center'
    },
    listItem: {
        marginTop: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 30,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    coverImage: {
        width: 100,
        height: 100,
        borderRadius: 8
    },
    metaInfo: {
        //   marginLeft: 10
    },
    title: {
        fontSize: 18,
    },
    errorMsg: {
        color: 'red',
        textAlign:'left'
    },
    buttonStyles: {
        alignItems: 'center',
        backgroundColor: 'blue',
        width: '80%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 8
    },
    footerButton:{
        left:0,
        right:0,
        bottom:50,
        position:'absolute'
    }
});