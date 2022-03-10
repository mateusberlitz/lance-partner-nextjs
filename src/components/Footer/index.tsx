import { Box, Flex, HStack, Img, Stack, Text, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { Facebook, Instagram, MapPin } from "react-feather";
import { TextTag } from "../TextTag";
import { FooterLink } from "./FooterLink";

import Whatsapp from '../../../public/icons/whatsapp.svg';
import { Broker } from "../../pages/[slug]";
import { storageApi } from "../../services/api";

interface FooterProps{
    broker: Broker;
}


export function Footer({broker} : FooterProps){
    const today = new Date();

    const phoneWithoutFormat = broker ? broker.phone.replace(/[\(\)\s\-]/g, '') : '';

    return (
        <Flex flexDir="column" w="100%" bg="gray.900" color="white" px="6">
            <Stack direction={["column", "column", "row"]} spacing={["16", "14", "12"]} bg="gray.900" w="100%" maxW="1200px" m="0 auto" py="20" justifyContent="space-between">
                <Stack direction={["row", "row", "column"]} spacing="16">
                    <Flex borderRadius="full" bg="gray.500" w="150px" h="150px" alignItems="center" justifyContent="center" overflow="hidden">
                        {
                            broker.logo && <Img maxW="100%" src={`${storageApi}${broker.logo}`} alt="Lance Consórcio - O plano para conquistar seus sonhos" flexWrap="wrap"/>
                        }
                    </Flex>
                
                    {/* <Stack spacing="6">
                        <Text>Conteúdos e novidades</Text>
                        <HStack spacing="4">
                            <Link href="https://www.facebook.com/Lanceconsorcios">
                                <a><Facebook/></a>
                            </Link>

                            <Link href="https://www.instagram.com/lanceconsorcio/">
                                <a><Instagram/></a>
                            </Link>
                            
                            <ChakraLink href="https://api.whatsapp.com/send?phone=5551997014449"  target="_blank" pl="2"><Whatsapp fill="#fff" width="23px"/></ChakraLink>
                            
                        </HStack>
                    </Stack> */}
                </Stack>

                <Stack>
                    <ChakraLink as="a" href={`mailto:${broker.email_display ? broker.email_display : broker.email}`}>{broker.email_display ? broker.email_display : broker.email}</ChakraLink>
                    <ChakraLink href={`https://api.whatsapp.com/send?phone=55${phoneWithoutFormat}`}>{broker.phone}</ChakraLink>
                </Stack>

                {/* <Stack spacing="6">
                    <TextTag color="gray.300">AÇÕES</TextTag>

                    <Stack spacing="2" fontSize="sm">
                        <FooterLink href="https://usa.lanceconsorcio.com.br/florida" >Imóveis na Flórida</FooterLink>
                        <FooterLink href="/vender">Vender consórcio</FooterLink>
                        <FooterLink href="https://www.hsconsorcios.com.br/cliente/declaracao-imposto-renda">Declaração de IR</FooterLink>
                        <FooterLink href="https://www.hsconsorcios.com.br/cliente/boleto">2ª Via do Boleto</FooterLink>
                        <FooterLink href="https://old.lanceconsorcio.com.br/cliente">Área do cliente</FooterLink>
                        <FooterLink href="/contempladas">Contempladas</FooterLink>
                    </Stack>
                </Stack>

                <Stack spacing="6">
                    <TextTag color="gray.300">PÁGINAS</TextTag>

                    <Stack spacing="2" fontSize="sm">
                        <FooterLink href="/consorcio">Entenda o Consórcio</FooterLink>
                        <FooterLink href="/imoveis">Consórcio de Imóvel</FooterLink>
                        <FooterLink href="/veiculos">Consórcio de Veículo</FooterLink>
                        <FooterLink href="/faq">Dúvidas Frequentes</FooterLink>
                        <FooterLink href="/sobre">Sobre Nós</FooterLink>
                        <FooterLink href="/smiles">Smiles</FooterLink>
                        <FooterLink href="/blog">Blog</FooterLink>
                    </Stack>
                </Stack> */}

            </Stack>

            <Stack direction={["column", "row", "row"]} spacing="8" w="100%" maxW="1200px" m="0 auto" py="8" justifyContent="space-between" borderTop="1px solid #222" color="gray.300">
                <Stack>
                    <HStack>
                        <MapPin width="14px"/>
                        <Text fontSize="12">{broker.address}</Text>
                    </HStack>

                    <Text fontSize="12">© {today.getFullYear()} Dev Gate - Todos os direitos reservados</Text>
                </Stack>
            </Stack>
        </Flex>
    )
}