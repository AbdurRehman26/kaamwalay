import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const AccordionCardItemContext = createContext<null | {
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>(null);

interface AccordionCardItemProviderProps {
    isExpanded?: boolean;
}

export function AccordionCardItemProvider({ children, ...props }: PropsWithChildren<AccordionCardItemProviderProps>) {
    const [isExpanded, setIsExpanded] = useState(false);

    const state = useMemo(
        () => ({
            isExpanded,
            setIsExpanded,
        }),
        [isExpanded, setIsExpanded],
    );

    useEffect(() => {
        if (typeof props.isExpanded !== 'undefined') {
            setIsExpanded(props.isExpanded);
        }
    }, [props.isExpanded]);

    return <AccordionCardItemContext.Provider value={state}>{children}</AccordionCardItemContext.Provider>;
}

export function useAccordionCardItemContext() {
    return useContext(AccordionCardItemContext)!;
}
