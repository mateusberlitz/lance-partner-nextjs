
import { Flex } from "@chakra-ui/layout";
import { useState } from "react";
import { BlockPicker } from "react-color";

interface ColorPickerProps{
    color: string,
    setNewColor: (color: string) => void,
}

export function ColorPicker({ color, setNewColor }: ColorPickerProps ){
    const [showColorPicker, setShowColorPicker] = useState(false);
    //const [color, setColor] = useState('#ffffff');

    const handleOpenColorPicker = () => {
        setShowColorPicker(true);
    }

    const handleCloseColorPicker = () => {
        setShowColorPicker(false);
    }

    const handleChangeColor = (color:any) => {
        setNewColor(color.hex);
    }

    return(
        <Flex pos="relative">
            <Flex 
                onClick={showColorPicker ? handleCloseColorPicker : handleOpenColorPicker}
                bg={color} 
                w="20px" h="20px" borderRadius="full" border="2px" borderColor="gray.500" cursor="pointer">
            </Flex>

            {
                showColorPicker && (
                    <Flex pos="absolute" left="-75px" zIndex="90" top="40px">
                        {/* <IconButton h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#dddddd" fill="none"/>} variant="outline"/> */}
                        <BlockPicker color={color} onChange={handleChangeColor}/>
                    </Flex>
                )
            }
            
        </Flex>
    )
}