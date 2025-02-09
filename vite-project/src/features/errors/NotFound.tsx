import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
              <Icon name='search' />
            <p>Sorry, the page you are looking for does not exist.</p>
            </Header>
        <Segment.Inline>
            <Button as={Link} to='/activities' primary>
                Return to Activities page
            </Button>
            </Segment.Inline>
            </Segment>
    );
};
