import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectPagination } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';

const FeedPaginationBox = styled(Box)({
    display: 'inline-flex',
    marginLeft: '100px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: '35px',
    },

    '.PaginationLink': {
        display: 'inline-flex',
        marginLeft: '25px',
    },
});

const CustomPagination = connectPagination(
    ({
        currentRefinement,
        nbPages,
        refine,
        createURL,
    }: {
        currentRefinement: any;
        nbPages: any;
        refine: any;
        createURL: any;
    }) => {
        return (
            <FeedPaginationBox>
                <Typography>
                    1 - {nbPages} of {currentRefinement}
                </Typography>
                <ul className={'PaginationLink'}>
                    {currentRefinement > 1 ? (
                        <li>
                            <a
                                href={createURL(currentRefinement - 1)}
                                onClick={(event) => {
                                    event.preventDefault();
                                    refine(currentRefinement - 1);
                                }}
                            >
                                <ChevronLeftOutlinedIcon />
                            </a>
                        </li>
                    ) : (
                        <li>
                            <ChevronLeftOutlinedIcon />
                        </li>
                    )}
                    {currentRefinement < nbPages ? (
                        <li>
                            <a
                                href={createURL(currentRefinement + 1)}
                                onClick={(event) => {
                                    event.preventDefault();
                                    refine(currentRefinement + 1);
                                }}
                            >
                                <ChevronRightOutlinedIcon />
                            </a>
                        </li>
                    ) : (
                        <li>
                            <ChevronRightOutlinedIcon />
                        </li>
                    )}
                </ul>
            </FeedPaginationBox>
        );
    },
);

export function FeedPagination() {
    return <CustomPagination />;
}

export default FeedPagination;
