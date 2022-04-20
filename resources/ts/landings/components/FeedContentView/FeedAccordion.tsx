import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import FeedGrade from './FeedGrade';
import FeedMobileCategories from './FeedMobileCategories';
import FeedSortBy from './FeedSortBy';

export function FeedAccordion() {
    const categoryTeal = useSelector((state: RootState) => state.feed.categoryTeal.teal);
    const gradeTeal = useSelector((state: RootState) => state.feed.gradeTeal.teal);

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    sx={{ padding: '5px 20px' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <div>
                        <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                            Sort
                        </Typography>
                        <Typography>Most Recent</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <FeedSortBy />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    sx={{ padding: '5px 20px' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>
                        Category {categoryTeal ? <CircleIcon sx={{ fontSize: '12px', color: '#20BFB8' }} /> : null}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FeedMobileCategories />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    sx={{ padding: '5px 20px' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>
                        Grade {gradeTeal ? <CircleIcon sx={{ fontSize: '12px', color: '#20BFB8' }} /> : null}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginBottom: '60px' }}>
                    <FeedGrade />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default FeedAccordion;
