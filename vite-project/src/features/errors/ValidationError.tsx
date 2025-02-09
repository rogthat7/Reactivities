import { Message } from "semantic-ui-react";

interface ValidationErrorProps {
    errors: string[];
}
export default function ValidationError({errors} : ValidationErrorProps) {
    return (
        <Message error>
            <Message.Header>Validation error</Message.Header>
            {
            errors && (
                <Message.List>
                    {errors.map((error, i) => (<Message.Item key={i}>{error}</Message.Item>))}
                </Message.List>
            )
            }
        </Message>
    ) 
}