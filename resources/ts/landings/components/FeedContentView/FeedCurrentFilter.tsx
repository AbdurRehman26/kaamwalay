import Chip from '@mui/material/Chip';
import React from 'react';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { connectCurrentRefinements } from 'react-instantsearch-dom';

export function FeedCurrentFilter() {
    const CurrentRefinements = ({ items, refine }: { items: any; refine: any }) => (
        <ul>
            {items.map((item: any) => (
                <li key={item.label}>
                    {item.items ? (
                        <React.Fragment>
                            {item.items.map((nested: any) => (
                                <Chip
                                    key={nested.label}
                                    label={nested.label}
                                    variant="outlined"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        refine(nested.value);
                                    }}
                                    icon={<CancelRoundedIcon />}
                                />
                            ))}
                        </React.Fragment>
                    ) : (
                        <Chip
                            key={item.label}
                            label={item.label.replace('grade:', '')}
                            variant="outlined"
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                            icon={<CancelRoundedIcon />}
                        />
                    )}
                </li>
            ))}
        </ul>
    );

    const CustomCurrentRefinements = connectCurrentRefinements(CurrentRefinements);
    return <CustomCurrentRefinements />;
}

export default FeedCurrentFilter;
