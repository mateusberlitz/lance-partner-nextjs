import { AccordionItem as ChakraAccordionItem, AccordionButton, AccordionPanel, Box, AccordionIcon, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface AccordionItemProps{
    title: string;
    children?: ReactNode;
}

export function AccordionItem({title, children}: AccordionItemProps){
    return(
        <ChakraAccordionItem>
            <h2>
                <AccordionButton py="5" pos="relative" _expanded={{_before: {content: '""', pos: 'absolute', height: '30px', width: '2px', bg: 'red.400', left: '0', top: '15px'}}} _focus={{boxShadow: 'none'}}>
                    <Box flex='1' textAlign='left' fontSize="lg">
                        {title}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <Text fontSize="sm">
                    {children}
                </Text>
            </AccordionPanel>
        </ChakraAccordionItem>
    )
}