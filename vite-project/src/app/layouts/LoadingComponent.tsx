import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    inverted?: boolean;
    content?: string;

}
const LoadingComponent: React.FC<Props> = ({ content = 'Loading...' }: Props) => {
    return (
        <Dimmer active inverted>
            <Loader content={content}></Loader>
        </Dimmer>
    );
};

export default LoadingComponent;