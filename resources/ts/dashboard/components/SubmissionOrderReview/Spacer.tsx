import React from 'react';

type SpacerProps = {
    top: string;
};

function Spacer(props: SpacerProps) {
    const { top } = props;

    return <div style={{ marginTop: top }}>{/*{ Silence is gold }*/}</div>;
}

export default Spacer;
