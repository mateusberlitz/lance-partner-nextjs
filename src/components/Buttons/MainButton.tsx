import { ButtonProps } from "@chakra-ui/react"
import { ReactNode } from "react"
import { SolidButton } from "./SolidButton"

interface MainButtonProps extends ButtonProps{
    children: string;
}

export function MainButton({children, ...rest} : MainButtonProps){
    return(
        <SolidButton size="lg" bg="linear-gradient(225deg, #000000 0%, rgba(0, 0, 0, 0.6) 100%);" color="white" {...rest}>
            {children}
        </SolidButton>
    )
}