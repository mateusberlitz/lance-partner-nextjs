import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, HStack, Icon, Img, Stack, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderLink } from "./HeaderLink";
import HeaderLinkList from "./HeaderLinkList";
import { Mail, Menu } from "react-feather";
import { Broker } from "../../pages/[slug]";
import Whatsapp from '../../../public/icons/whatsapp.svg';

interface HeaderProps{
    broker: Broker;
}

export function Header({broker}: HeaderProps){
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    return (
        <Flex w="100vw" px="6" bg="rgba(0,0,0,0.4);" backdropFilter="blur(20px)" pos="fixed" top="0" zIndex="99" h="68px">
            <HStack w="100%" m="0 auto" maxW="1200px" py="0" justify="space-between" fontWeight="normal" color="white">
                <Link href="/">
                    <a href={`https://centraldecontempladas.com.br/${broker.slug}`}>
                        {
                            //broker.logo && <Img w="100%" maxW={["100px", "100px", "100px" ]} src={`${storageApi}${broker.logo}`} alt="Lance Consórcio - O plano para conquistar seus sonhos" flexWrap="wrap"/>
                        }
                        <Text fontSize={["md", "lg", "xl"]}>{broker.name_display ? broker.name_display : broker.name}</Text>
                    </a>
                </Link>

                {
                    isWideVersion ? (
                        <>
                            <Stack direction={isWideVersion ? "row" : "column"} spacing="8">
                                <HeaderLink href={`mailto:${broker.email}`}><Icon as={Mail} width="12px" stroke="#fff" mr="2"/>E-mail</HeaderLink>
                                <HeaderLink href={`https://api.whatsapp.com/send?phone=55${broker.phone.replace(/[\(\)\s\-]/g, '')}`}><Icon as={Whatsapp} width="12px" fill="#fff" mr="2"/> Contato</HeaderLink>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Button bg="transparent" onClick={onOpen} px="2">
                                <Text mr="3">Menu</Text>
                                <Icon as={Menu} w="26px" h="26px" stroke="#fff" fill="none"/>
                            </Button>
                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                                //finalFocusRef={btnRef}
                            >
                                <DrawerOverlay />
                                <DrawerContent px="7" pr="16" bg="rgba(0,0,0,0.4);" backdropFilter="blur(20px)" color="white">
                                    <DrawerCloseButton fontSize="16px" top="3" right="4"/>
                                    <Stack direction={isWideVersion ? "row" : "column"} spacing="8">
                                        <HeaderLink href={`mailto:${broker.email}`}><Icon as={Mail} width="12px" fill="#fff" mr="2"/> E-mail</HeaderLink>
                                        <HeaderLink href={`https://api.whatsapp.com/send?phone=55${broker.phone.replace(/[\(\)\s\-]/g, '')}`}><Icon as={Whatsapp} width="12px" fill="#fff" mr="2"/> Contato</HeaderLink>
                                    </Stack>
                                </DrawerContent>
                            </Drawer>
                        </>
                    )
                }
                
            </HStack>
        </Flex>
    )
}