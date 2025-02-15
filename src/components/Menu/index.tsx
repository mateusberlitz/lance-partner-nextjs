import { Divider, Flex, Heading, HStack, Icon, Img } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart, List, LogOut, Settings } from "react-feather";
import { useProfile } from "../../contexts/useProfile";
import { OutlineButton } from "../Buttons/OutlineButton";
import { SolidButton } from "../Buttons/SolidButton";

export function Menu(){
    const { profile, signOut } = useProfile();
    const router = useRouter();

    return(
        <Flex flexDir="column" w="100%" bg="white" boxShadow="sm" mb="10" px="6">
            <HStack w="100%" maxW="1000px" m="0 auto" py="8" justifyContent="space-between">
                <HStack spacing={["6","6"]}>
                    <a href="/admin/">
                        <Img w="100%" maxW={["100px", "100px", "100px" ]} src={`/lance.svg`} alt="Lance Consórcio - O plano para conquistar seus sonhos" flexWrap="wrap"/>
                    </a>
                    <Divider orientation="vertical" borderColor="red.500" h="30px" />
                    <Heading fontSize={["lg", "xl", "xl" ]} fontWeight="normal" color="gray.900">Plataforma de contempladas</Heading>
                </HStack>

                <HStack>
                    <Link href="/admin/">
                        {
                            router.asPath === '/admin' ? (
                                <SolidButton px="4" size="sm" leftIcon={<Icon as={List} />} borderColor="gray.300" bgColor="black" color="white" _hover={{borderColor: 'gray.900'}}>
                                    Cartas
                                </SolidButton>
                            ) : (
                                <OutlineButton px="4" size="sm" leftIcon={<Icon as={List} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                                    Cartas
                                </OutlineButton>
                            )
                        }
                    </Link>
                    <Link href="/admin/dashboard">
                        {
                            router.asPath === '/admin/dashboard' ? (
                                <SolidButton px="4" size="sm" leftIcon={<Icon as={BarChart} />} borderColor="gray.300" bgColor="black" color="white" _hover={{borderColor: 'gray.900'}}>
                                    Dashboard
                                </SolidButton>
                            ) : (
                                <OutlineButton px="4" size="sm" leftIcon={<Icon as={BarChart} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                                    Dashboard
                                </OutlineButton>
                            )
                        }
                    </Link>
                    <Link href="/admin/configuration">
                        {
                            router.asPath === '/admin/configuration' ? (
                                <SolidButton px="4" size="sm" leftIcon={<Icon as={Settings} />} borderColor="gray.300" bgColor="black" color="white" _hover={{borderColor: 'gray.900'}}>
                                    Configurações
                                </SolidButton>
                            ) : (
                                <OutlineButton px="4" size="sm" leftIcon={<Icon as={Settings} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                                    Configurações
                                </OutlineButton>
                            )
                            
                        }
                    </Link>
                    <OutlineButton onClick={() => signOut()} px="4" size="sm" leftIcon={<Icon as={LogOut} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                        Sair
                    </OutlineButton>
                </HStack>
            </HStack>
        </Flex>
    )
}