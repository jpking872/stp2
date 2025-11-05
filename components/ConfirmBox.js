import React, {useState} from 'react';
import { Modal, Button, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import '../utils/global';

function ConfirmBox(props) {

    const styles = createStyles(props);

    return (
        <View style={styles.container}>
            <Modal transparent={true} visible={props.visible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text>{props.message}</Text>
                        <View style={styles.group}>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.buttons} title="Confirm" onPress={() => {
                                props.onPress();
                                props.hideModal();
                            }}>
                                <Text style={styles.text}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} title="Cancel" onPress={props.hideModal} >
                                <Text style={styles.text}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </View>
            </Modal>
        </View>
    );
}

    const createStyles = (props) => StyleSheet.create({

        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modal: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: 300,
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
        },
        group: {
            alignItems: 'center'
        },
        text: {
          color: '#FFFFFF',
            alignItems: 'center'
        },
        buttons: {
            backgroundColor: global.DARK_COLOR,
            paddingVertical: 6,
            paddingHorizontal: 18,
            borderRadius: 4,
            width:'100px',
            marginHorizontal: 20
        }
    });

export default ConfirmBox;