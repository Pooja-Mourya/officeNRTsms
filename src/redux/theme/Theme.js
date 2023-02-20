import React, { useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { changeTextColor } from './ThemeSlice'

function Theme() {
    const [color, setColor] = useState('')
    const dispatch = useDispatch()
    return (
        <View>
            <TouchableOpacity onPress={(p) => setColor(p)}>
                <Text onClick={() => { dispatch(changeTextColor(color)) }}>Change Color</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Theme