import { useEffect, useState } from 'react';
import { useChannel } from 'ably/react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem,
    TextField,
} from '@mui/material';
import { NumberInput } from './NumberInput';
import * as R from 'ramda';

interface TrackerMessage {
    name: string;
    data: string;
}

export const InitiativeTracker = () => {
    const [messages, updateMessages] = useState<TrackerMessage[]>([]);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const { channel } = useChannel('init-tracker', (message) => {
        const messageIndex = R.findIndex(R.propEq(message.name, 'name'))(messages);
        if(messageIndex === -1){
            updateMessages([...messages, message]);
        } else {
            updateMessages(R.update(messageIndex, (message) as TrackerMessage, messages))
        }
    });

    const getTrackerHistory = async () => {
        const messages = await channel.history()
        const sortedFilteredMessages: TrackerMessage[] = [];
        messages.items.forEach(m => {
            const messageIndex = R.findIndex(R.propEq(m.name, 'name'))(sortedFilteredMessages);
            if(messageIndex === -1){
                const lastMessage = R.last(messages.items.filter(x => x.name === m.name).sort((a, b) => a.timestamp - b.timestamp))
                sortedFilteredMessages.push(lastMessage as TrackerMessage)
            }
        })
        updateMessages(sortedFilteredMessages)
    }

    useEffect(() => {
        getTrackerHistory()
    }, []);
    return (
        <Card>
            <CardHeader title='Initiative Tracker'/>
            <CardContent sx={{display: 'flex'}}>
                <Grid container>
                    <Grid item xs={6}>
                    <TextField
                        value={name}
                        label='Name'
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                    />
                    <NumberInput
                        value={score}
                        label='Initiative Score'
                        onChange={(e) => setScore(e.target.value)}
                    />
                    </Grid>  
                <Grid item xs={6}>
                    {!!messages.length && <List>
                        {messages.sort((a,b) => Number(b.data) - Number(a.data)).map((m: TrackerMessage) => {
                            return <ListItem key={m.name}>{`${m.name} ${Number(m.data)}`}</ListItem>
                        })}
                    </List>}
                </Grid>
                </Grid>
            </CardContent>
            <CardActions>
            <Button onClick={() => channel.publish(name, score)}>
                Update Initiative
            </Button>
            </CardActions>
        </Card>
    );
};
