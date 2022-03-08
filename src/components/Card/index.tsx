import { ChakraProps, Flex, Heading, Img, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MainButton } from "../Buttons/MainButton";
import { SolidButton } from "../Buttons/SolidButton";

interface CardProps extends ChakraProps{
    title: string;
    text: string;
    hasButton?: Boolean;
    hrefArea?: Boolean;
    href?: string;
    imgUrl?: string;
}

export function Card({title, text, imgUrl, href, hasButton = true, hrefArea = false, ...rest} : CardProps){
    const router = useRouter();

    return (
        <Flex as="a" href={href} flexDir="column" overflow="hidden" borderRadius="6" justifyContent="space-between" {...rest}>

              <Stack spacing="6" p="6">
                <Text fontWeight="semibold" color="gray.600">Categoria</Text>

                <Heading fontSize="3xl">Título de uma publicação genérica para o blog.</Heading>

                {
                  hasButton && (
                    <MainButton size="sm" onClick={() => {href && router.push(href)}}>
                      Ver mais
                    </MainButton>
                  )
                }
              </Stack>

              <Flex w="100%" alignItems="end">
                  <Img src={imgUrl} alt={title} w="100%"/>
              </Flex>

        </Flex>
    )
}