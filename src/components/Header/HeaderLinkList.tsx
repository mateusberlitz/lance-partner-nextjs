import { HStack, Stack, useBreakpointValue } from "@chakra-ui/react";
import { HeaderLink } from "./HeaderLink";

export default function HeaderLinkList(){
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    return (
        <>
            <Stack direction={isWideVersion ? "row" : "column"} spacing="8">
                <HeaderLink href="/vender">E-mail</HeaderLink>
                <HeaderLink href={`https://api.whatsapp.com/send?phone=555195847644`}>Contato</HeaderLink>
            </Stack>
        </>
    )
}