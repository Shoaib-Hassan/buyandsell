import { StyleSheet, Text, View, Modal, TouchableOpacity, Pressable, Image, ScrollView, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { child, getDatabase, push, ref, set, } from "firebase/database";

import { Alert } from 'react-native';

const SellingDetails = ({ modalVisible, setModalVisible, hideCategoryModal, category, categoryName, categoryURL, editMode, dataToEdit, onEditListing }) => {

    const [inputFields, setInputFields] = useState(['']);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [urlErrors, setUrlErrors] = useState(['']);
    const [priceError, setPriceError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    useEffect(() => {

        if (editMode) {

            setInputFields(dataToEdit.images);
            setTitle(dataToEdit.title);
            setDescription(dataToEdit.description);
            setPrice(dataToEdit.price);
        }
    }, [editMode, dataToEdit]);




    const regex = /[-\s.,]/;
    const validatePrice = (price) => {

        if (price == '') {

            setPriceError('Please enter a price');
            setPrice('')
            return false;
        }
        else if (regex.test(price)) {
            setPriceError('Price cannot include "-", spaces, ".", or ","');
            return false;
        }
        else if (price <= 0) {
            setPriceError('Value should be greater than 0')

            return false;
        }
        else {

            setPrice(price)
            setPriceError('');
            return true;
        }
    }
    const validateTitle = (title) => {
        if (title == '') {
            setTitleError('Please enter a title');
            setTitle("")
            return false;
        }
        else if (title.length < 5) {
            setTitleError('Title Should be at Least 5 Characters');

            setTitle(title)
            return false;
        }
        else {

            setTitle(title)
            setTitleError('');
            return true;
        }
    }
    const validateDescription = (description) => {
        if (description == '') {
            setDescriptionError("Please enter a description");
            setDescription("")
            return false;
        }
        else if (description.length < 100) {
            setDescriptionError('Description Should be at Least 100 Characters');
            setDescription(description)
            return false;
        }
        else {

            setDescription(description)
            setDescriptionError('');
            return true;
        }
    }

    const hideModal = () => {
        setModalVisible(false);
    };

    const addInputField = () => {
        if (inputFields.length < 5) {
            setInputFields([...inputFields, '']);
        }
    };
    const removeInputField = (index) => {
        const updatedInputFields = [...inputFields];
        updatedInputFields.splice(index, 1);
        setInputFields(updatedInputFields);
        const updatedUrlErrors = [...urlErrors];
        updatedUrlErrors.splice(index, 1);
        setUrlErrors(updatedUrlErrors);
    };

    const handleInputChange = (text, index) => {


        const updatedInputFields = [...inputFields];
        const updatedUrlErrors = [...urlErrors];
        updatedInputFields[index] = text;
        updatedUrlErrors[index] = ''

        if (/^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view/.test(text)) {

            const fileId = text.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/)[1];
            const directImageLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

            // Make an HTTP request to the URL
            fetch(directImageLink, { method: 'HEAD' })
                .then(response => {
                    // Check the Content-Type header to ensure it's an image

                    const contentType = response.headers.get('Content-Type');

                    if (contentType && contentType.startsWith('image/')) {

                        updatedUrlErrors[index] = '';
                        return true;

                    } else {
                        updatedUrlErrors[index] = 'Not a valid image URL';

                    }
                })
                .catch(error => {
                    updatedUrlErrors[index] = 'Error checking the URL';
                    console.error('Error checking the URL:', error);
                    ;
                });
        } else if (text === '') {
            updatedUrlErrors[index] = 'Please enter the Image URL';


        } else {
            updatedUrlErrors[index] = 'Not a valid Google Drive URL';

        }

        setInputFields(updatedInputFields);
        setUrlErrors(updatedUrlErrors);

    };

    const validateImage = () => {
        const updatedUrlErrors = Array(inputFields.length).fill(''); // Initialize errors with empty strings

        for (let i = 0; i < inputFields.length; i++) {
            if (inputFields[i] === '') {
                updatedUrlErrors[i] = 'Please enter the Image URL';
            }
        }

        setUrlErrors(updatedUrlErrors); // Update errors in the state


        // Check if there are any errors in the updatedUrlErrors array
        const hasErrors = updatedUrlErrors.some(error => error !== '');

        return !hasErrors; // Return true if there are no errors, false if there are errors
    }
    const handleEditListing = () => {
        if (editMode) {

            onEditListing({
                images: inputFields,
                title,
                description,
                price,
            }, dataToEdit.id);
        } else {

            writeUserData(inputFields, description, price, title);


        }
        hideModal();
    };


    function writeUserData(images, description, price, title) {


        const newKey = push(child(ref(getDatabase()), 'listings')).key;

        set(ref(getDatabase(), 'listings/' + newKey), {
            owner: "malik.sh1224@gmail.com",
            images: images,
            description: description,
            category: category.name,
            categoryURL: category.icon,
            price: price,
            status: "active",
            title: title,
            time: Date.now()
        });
        Alert.alert(
            'Success',
            'Your listing has been added successfully',
            [
                { text: 'OK', onPress: () => hideCategoryModal() },
            ],
            { cancelable: false }

        )
    }


    return (
        <Modal
            animationType="fade"
            visible={modalVisible}
            onRequestClose={hideModal}
        >
            <View style={{ flex: 1 }} >
                <View style={{ flexDirection: "row", position: 'absolute', paddingLeft: 20, height: 50, width: "100%", alignItems: "center", borderBottomWidth: 1, borderColor: "#ccc", backgroundColor: "#ccc" }}>
                    <TouchableOpacity onPress={hideModal}>
                        <Image source={require('../assets/close.png')} // Replace with actual image path
                            style={styles.closeIcon}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, marginLeft: 50 }}>
                        {editMode ? "Edit Post" : "Add Post"}
                    </Text>
                </View>


                <ScrollView style={{ marginTop: 70, marginHorizontal: 15, }} showsVerticalScrollIndicator={false} >
                    <Text style={[{ textAlign: "center" }, styles.categoryText]}>UPLOAD UPTO 5 IMAGES TO GOOGLE DRIVE AND SUMBIT THEIR LINKS BELOW</Text>
                    {inputFields.map((text, index) => (
                        <View key={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    value={text}
                                    placeholder="Google Drive Image URL"
                                    onChangeText={(text) => {
                                        handleInputChange(text, index)
                                    }}
                                    style={styles.inputField}
                                />

                                {inputFields.length > 1 && (
                                    <TouchableOpacity onPress={() => removeInputField(index)} style={styles.trashBtn}>
                                        <FontAwesome5 name="trash" size={20} color="red" />
                                    </TouchableOpacity>
                                )}

                            </View>
                            <View>

                                <Text style={[styles.categoryText, { color: "red" }]}>{urlErrors[index]}</Text>
                            </View>
                        </View>
                    ))}
                    {inputFields.length < 5 && <TouchableOpacity onPress={addInputField} style={styles.addUrlBtn}>
                        <Text style={styles.addUrlText}>ADD MORE URLS</Text>
                    </TouchableOpacity >}
                    <View style={{ borderBlockColor: "#ccc", borderBottomWidth: 1, paddingVertical: 15 }}>
                        <Text style={styles.categoryText}>Category *</Text>
                        <View style={styles.category}>
                            <View style={styles.circularView}>
                                {category?.icon ? (
                                    <Image source={category.icon} style={styles.image} />
                                ) : (
                                    <Text>Icon not available</Text>
                                )}
                            </View>


                            <Text style={[styles.categoryText, { color: "grey" }]}> {category?.name || categoryName}</Text>
                        </View>
                    </View>



                    <View style={{ borderBlockColor: "#ccc", borderBottomWidth: 1, paddingVertical: 15 }}>
                        <Text style={styles.categoryText}>Price *</Text>
                        <TextInput
                            value={price}
                            maxLength={6}
                            keyboardType='numeric'
                            placeholder="Enter Price"
                            style={styles.inputField}
                            onChangeText={(text) => {
                                validatePrice(text)
                            }
                            }
                        />
                        <Text style={[styles.categoryText, { color: "red" }]}>{priceError}</Text>
                    </View>

                    <View style={{ borderBlockColor: "#ccc", borderBottomWidth: 1, paddingVertical: 15 }}>

                        <Text style={styles.categoryText}>Ad Title *</Text>
                        <TextInput
                            value={title}
                            maxLength={70}
                            placeholder="Title"
                            style={styles.inputField}
                            onChangeText={(text) => {
                                validateTitle(text)
                            }
                            }
                        />
                        <Text style={[styles.categoryText, { color: "red" }]}>{titleError}</Text>
                    </View>
                    <View style={{ borderBlockColor: "#ccc", borderBottomWidth: 1, paddingVertical: 15 }}>

                        <Text style={styles.categoryText}>Description *</Text>
                        <TextInput
                            value={description}
                            multiline={true}
                            numberOfLines={100}
                            placeholder="Description"
                            style={[styles.inputField, { height: 200, textAlignVertical: 'top', }]}
                            onChangeText={(text) => {
                                validateDescription(text)
                            }
                            }
                        />
                        <Text style={[styles.categoryText, { color: "red" }]}>{descriptionError}</Text>
                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity style={styles.postNowBtn} onPress={() => {

                        if (validatePrice(price) && validateTitle(title) && validateDescription(description) && validateImage()) {
                            handleEditListing();
                        }
                        else if (validatePrice(price) || validateTitle(title) || validateDescription(description) || validateImage()) { //500 rs

                            if (!validatePrice(price) && !validateTitle(title) && !validateDescription(description)) {

                                setPriceError("Please enter a price");
                                setTitleError("Please enter a title");
                                setDescriptionError("Please enter a description");
                            }
                            else if (!validatePrice(price) && !validateTitle(title)) { //500 //title
                                setPriceError("Please enter a price");
                                setTitleError("Please enter a title");
                            }
                            else if (!validateDescription(description) && !validatePrice(price)) {
                                setDescriptionError("Please enter a description");
                                setPriceError("Please enter a price");
                            }
                            else if (!validateTitle(title) && !validateDescription(description)) { //500
                                setDescriptionError("Please enter a description");
                                setTitleError("Please enter a title");
                            }
                        }



                    }}>
                        <Text style={styles.addUrlText}>{editMode ? "UPDATE NOW" : "POST NOW"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    )
}

export default SellingDetails

const styles = StyleSheet.create({
    image: {
        resizeMode: "cover",
        width: "100%",
        height: "100%",

    },
    circularView: {
        backgroundColor: "orange",
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 4,
        marginVertical: 5,
    },
    location: {
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    closeIcon: { width: 24, height: 24 },
    inputField: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 4,
        marginTop: 5,

    },
    trashBtn: {
        marginTop: 14,
        marginLeft: 5
    },
    addUrlBtn: {
        marginVertical: 10,
        alignItems: "center",
        backgroundColor: "orange",
        borderRadius: 5,
        padding: 10,

    },
    addUrlText: {
        fontWeight: "bold",
        fontSize: 15,
        color: "white"
    },
    categoryText: {
        fontWeight: "bold",
        fontSize: 15,
    },
    category: {
        flexDirection: "row",
        alignItems: "center"
    },
    postNowBtn: {
        alignItems: "center",
        backgroundColor: "orange",
        marginVertical: 10,
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    }
})