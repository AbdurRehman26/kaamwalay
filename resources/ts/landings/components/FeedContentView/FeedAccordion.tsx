import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FeedMobileSortBy from './FeedMobileSortBy';
import FeedMobileCategories from './FeedMobileCategories';
import FeedMobileGrade from './FeedMobileGrade';

export function FeedAccordion({
    setFeedMobileSortByValue,
    feedMobileSortByValue,
}: {
    setFeedMobileSortByValue: any;
    feedMobileSortByValue: any;
}) {
    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Most Recent</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FeedMobileSortBy
                        setFeedMobileSortByValue={setFeedMobileSortByValue}
                        feedMobileSortByValue={feedMobileSortByValue}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                    <Typography>Category</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FeedMobileCategories />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
                    <Typography>Grade</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FeedMobileGrade />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default FeedAccordion;
