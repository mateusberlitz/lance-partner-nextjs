import { ChakraProps, Text, Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface HeaderLinkProps extends LinkProps{
    href: string;
    children: ReactNode;
}

export function HeaderLink({ href, children, ...rest }: HeaderLinkProps){
    const { asPath } = useRouter();

    const isActive = asPath === href;

    return (
        <Link href={href} passHref>
            <ChakraLink href={href} alignItems="center" borderBottom={"2px solid"} borderColor={isActive ? "first" : "transparent"} display="flex" cursor="pointer" h="68px" _hover={{textDecoration: 'none', borderBottom: '2px solid', borderColor: 'first'}} _focus={{border: 'none'}} {...rest}>
                {children}
            </ChakraLink>
        </Link>
    )
}