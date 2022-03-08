import { Button, ButtonProps } from "@chakra-ui/react";
import Icon from "@chakra-ui/icon";
import { ElementType } from "react";

export interface ButtonModelProps extends ButtonProps{
    icon?: ElementType;
    children: string;
}

export function SolidButton({icon, children, ...rest} : ButtonModelProps){

    const boxShadowColor = (rest.colorScheme === 'red' ? "#e53e3e" : (rest.colorScheme === 'green' ? "#38a169" : (rest.colorScheme === 'blue' ? "#002d56" : ( rest.colorScheme === 'orange' ? "#dd6b20": "#222222"))));

    return (
        <Button px="8" w="fit-content" borderRadius="3px" fontWeight="regular" leftIcon={icon && <Icon as={icon} stroke="#ffffff" fontSize="16" fill="none" mr="2"/>} variant="solid" fontSize="sm" {...rest} _hover={{boxShadow: `0 8px 20px -8px ${boxShadowColor}`}} _active={{}}>
            {children}
        </Button>
    )
}