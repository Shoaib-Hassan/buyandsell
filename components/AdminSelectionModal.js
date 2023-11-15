import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { Button } from 'react-native-paper';



const AdminSelectionModal = ({ isVisible, onClose, onAdminSelect}) => {
  const AdminDetails = [
    {
      id: 1,
      name: "Shoaib Hassan",
      email: "malik.sh1224@gmail.com",
      pic: require('../assets/roles/admin-avatar.png'),
    },

  ];

  const [clicked, setClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [chatName, setChatName] = useState('');




  const handleAdminSelection = () => {
    if (selectedAdmin === '') {
      ToastAndroid.show("Select the Admin First", ToastAndroid.SHORT);
    } else {
      setCurrentPage(2); // Move to the next page
    }
  };

  const handleChatNameSubmit = () => {
    if (selectedAdmin === '' || chatName === '') {
      ToastAndroid.show("Please enter the Chat Name",ToastAndroid.SHORT);
    } else {
      onAdminSelect(selectedAdmin.email, chatName);
      setChatName('');
      setSelectedAdmin('');
      setCurrentPage(1);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", borderRadius: 10, padding: 20, width: "80%", height: 250 }}>
          {currentPage === 1 ? ( // Render content for the first page
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select an Admin</Text>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    zIndex: 1,
                  }}
                  onPress={() => {
                    setClicked(!clicked);
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>
                    {selectedAdmin === '' ? 'Select Admin' : selectedAdmin.name}
                  </Text>
                  {clicked ? (
                    <Image source={require('../assets/upload.png')} style={{ width: 20, height: 20 }} />
                  ) : (
                    <Image source={require('../assets/dropdown.png')} style={{ width: 20, height: 20 }} />
                  )}
                </TouchableOpacity>
                {clicked ? (
                  <View
                    style={{
                      elevation: 5,
                      marginTop: 20,
                      height: 200,
                      alignSelf: 'center',
                      width: '100%',
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      position: 'absolute',
                      top: 70,
                      zIndex: 2,
                    }}
                  >
                    {AdminDetails.map((admin) => (
                      <TouchableOpacity
                        key={admin.id}
                        style={{
                          width: '85%',
                          alignSelf: 'center',
                          height: 50,
                          justifyContent: 'center',
                          borderBottomWidth: 0.5,
                          borderColor: '#8e8e8e',
                        }}
                        onPress={() => {
                          setSelectedAdmin(admin);
                          setClicked(!clicked);
                        }}
                      >
                        <Text style={{ fontWeight: '600' }}>{admin.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>
              <Button onPress={handleAdminSelection} buttonColor='orange' textColor='white'>Next</Button>
            </>
          ) : currentPage === 2 ? ( // Render content for the second page
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Enter the Chat Name: </Text>
              <TextInput
              maxLength={30}
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  marginVertical: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  zIndex: 1,
                }}
                value={chatName}
                onChangeText={(text) => setChatName(text)}
                placeholder="Chat Name"
                
              />
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <Button onPress={() => setCurrentPage(1)} buttonColor='orange' textColor='white' style={{ width: 100 }}>Back</Button>
                <Button onPress={handleChatNameSubmit} buttonColor='green' textColor='white' style={{ width: 100 }}>Submit</Button>
              </View>
            </>
          ) : null}
          <Button onPress={() => {
            setChatName('')
            setSelectedAdmin('')
            setCurrentPage(1)
            onClose()
          }} buttonColor='black' textColor='white' style={{ marginTop: 5 }}>Cancel</Button>
        </View>
      </View>
    </Modal>
  );
}

export default AdminSelectionModal;