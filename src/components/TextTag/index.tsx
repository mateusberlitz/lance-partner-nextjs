import { Text, ChakraProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TextTagProps extends ChakraProps{
    children?: ReactNode;
}

export function TextTag({children, ...rest} : TextTagProps){
    return (
        <Text textTransform="uppercase" letterSpacing="0.2em" fontWeight="semibold" fontSize="sm" color="gray.700" {...rest}>{children}</Text>
    )
}