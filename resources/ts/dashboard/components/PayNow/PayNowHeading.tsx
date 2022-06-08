interface PayNowHeadingProps {
    remainingTime: any;
    hasClass: boolean;
}

export default function PayNowHeading(props: PayNowHeadingProps) {
    const { remainingTime, hasClass } = props;

    return (
        <b className={hasClass ? 'BoldTitle' : 'Title'}>
            {remainingTime.hours}h : {remainingTime.minutes}m : {remainingTime.seconds}s
        </b>
    );
}
