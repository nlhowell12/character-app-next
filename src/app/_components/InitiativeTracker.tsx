import { useEffect, useState } from 'react';
import { useChannel } from 'ably/react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    List,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import { NumberInput } from './NumberInput';
import * as R from 'ramda';

interface TrackerMessage {
    name: string;
    data: {
        value: string;
        delete: boolean;
    };
    id: string;
}

export const InitiativeTracker = () => {
    const [messages, updateMessages] = useState<TrackerMessage[]>([]);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [hiddenMessages, setHiddenMessages] = useState<string[]>([]);
    const { channel } = useChannel('init-tracker', (message) => {
        console.log(message)
        if(!!message.data.delete) {
            setHiddenMessages([...hiddenMessages, message.id])
        };
        const messageIndex = R.findIndex(R.propEq(message.name, 'name'))(
            messages
        );
        if (messageIndex === -1) {
            updateMessages([...messages, message]);
        } else {
            updateMessages(
                R.update(messageIndex, message as TrackerMessage, messages)
            );
        }
    });

    const getTrackerHistory = async () => {
        const messages = await channel.history();
        const sortedFilteredMessages: TrackerMessage[] = [];
        messages.items.forEach((m) => {
            const messageIndex = R.findIndex(R.propEq(m.name, 'name'))(
                sortedFilteredMessages
            );
            if (messageIndex === -1) {
                const lastMessage = R.last(
                    messages.items
                        .filter((x) => x.name === m.name)
                        .sort((a, b) => a.timestamp - b.timestamp)
                );
                sortedFilteredMessages.push(lastMessage as TrackerMessage);
            }
        });
        updateMessages(sortedFilteredMessages);
    };

    const handleDelete = (m: TrackerMessage) => {
        setHiddenMessages([...hiddenMessages, m.id])
    };

    useEffect(() => {
        getTrackerHistory();
    }, []);

    useEffect(() => {
        channel.subscribe('tracker-delete', handleDelete)
    }, [])

    return (
        <Card>
            <CardHeader title='Initiative Tracker' />
            <CardContent sx={{ display: 'flex' }}>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField
                            value={name}
                            label='Name'
                            fullWidth
                            sx={{ marginBottom: '.5rem' }}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <NumberInput
                            value={score}
                            label='Initiative Score'
                            onChange={(e) => setScore(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {!!messages.length && (
                            <List>
                                {messages.filter(x => !!x.data.value && (!hiddenMessages.includes(x.id) || !x.data.delete))
                                    .sort(
                                        (a, b) =>
                                            Number(b.data) - Number(a.data)
                                    )
                                    .map((m: TrackerMessage) => {
                                        return (
                                            <ListItem key={m.name} sx={{justifyContent: 'center'}}>
                                                <Chip label={`${
                                                    m.name
                                                } ${Number(
                                                    m.data.value
                                                )}`} onClick={() => channel.publish({name: m.name, data: {value: m.data.value, delete: true}, id: m.id, extras: {ref: {type: 'tracker-delete'}}})
                                            }
                                                sx={{ '&:hover': { opacity: '.6', cursor: 'pointer', textDecoration: 'line-through' },}}/>
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button onClick={() => channel.publish(name, {value: score, delete: false})}>
                    Update Initiative
                </Button>
            </CardActions>
        </Card>
    );
};
