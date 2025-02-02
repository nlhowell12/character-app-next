import { useContext, useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import { NumberInput } from './NumberInput';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import { mockInitiative } from '@/_mockData/general';
import UserContext from '../_auth/UserContext';

export interface TrackerMessage {
    name: string;
    data: {
        value: string | number;
        delete: boolean;
        id: string;
    };
    id: string;
}

export const InitiativeTracker = () => {
    const [messages, updateMessages] = useState<TrackerMessage[]>([]);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [turn, setTurn] = useState(1);
    const [currentCharacter, setCurrentCharacter] = useState(0);
    const { user } = useContext(UserContext);
    const { channel } = useChannel('init-tracker', (message) => {
        const messageIndex = R.findIndex(R.propEq(message.name, 'name'))(
            messages
        );
        if (messageIndex === -1) {
            updateMessages([...messages, message]);
        } else if(message.name === 'tracker-delete') {
            handleDelete(message)
        } else if(message.name === 'tracker-clear') {
            updateMessages([]);
        } else {
            updateMessages(
                R.update(messageIndex, message as TrackerMessage, messages)
            );
        }
    });

    const { channel: turnChannel } = useChannel('turn-tracker', (message) => {
        setTurn(message.data.value);
    });

    const { channel: currentCharChannel } = useChannel('currentChar', (message) => {
        setCurrentCharacter(message.data.value);
    });

    const getTrackerHistory = async () => {
        const messages = await channel.history();
        const turns = await turnChannel.history();
        const currentCharacter = await currentCharChannel.history();
        const sortedFilteredMessages: TrackerMessage[] = [];
        const lastTrackerClearTimestamp = R.last(messages.items.sort((a, b) => a.timestamp - b.timestamp).filter(x => x.name === 'tracker-clear'))?.timestamp;
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
                if(!!lastTrackerClearTimestamp && !!lastMessage && (lastMessage.timestamp > lastTrackerClearTimestamp)){
                    sortedFilteredMessages.push(lastMessage as TrackerMessage);
                }
            }
        });
        // updateMessages(sortedFilteredMessages);
        updateMessages(mockInitiative)
        const lastTurn = R.last(turns.items.sort((a, b) => a.timestamp - b.timestamp))
        !!lastTurn && setTurn(lastTurn.data.value);
        const lastCurrent = R.last(currentCharacter.items.sort((a, b) => a.timestamp - b.timestamp))
        !!lastCurrent && setCurrentCharacter(lastCurrent?.data.value);
    };

    const updateTurn = () => {
        const newTurn = turn + 1;
        setTurn(newTurn)
        turnChannel.publish('turn-update', {value: newTurn, delete: true})
    }
    const nextCharacter = () => {
        const sortedMessages = getSortedMessages();
        let nextCharacter;
        if(currentCharacter === sortedMessages.length - 1) {
            nextCharacter = 0
            updateTurn()
        } else {
            nextCharacter = currentCharacter + 1
        }
        currentCharChannel.publish('currentChar', {value: nextCharacter, delete: true})
        setCurrentCharacter(nextCharacter)
    };
    const deleteChip = (m: TrackerMessage) => {
        channel.publish('tracker-delete', {data: {value: m.data.value, delete: true}, id: m.id, extras: {ref: {type: 'tracker-delete'}}})
        handleDelete(m);
    };
    const handleDelete = (m: TrackerMessage) => {
        const filter = (x: TrackerMessage) => x.id !== m.data.id;
        updateMessages(R.filter(filter, messages))
    };
    const handleClear = () => {
        updateMessages([]);
        channel.publish('tracker-clear', {data: {value: 0, delete: true}, id: uuidv4(), extras: {ref: {type: 'tracker-clear'}}}) 
        setTurn(1);
        turnChannel.publish('turn-update', {value: 1})
    };

    const getIsCurrentCharacterChip = (m: TrackerMessage) => {
        const sortedMessages = getSortedMessages();
        const isCurrent = m.id === sortedMessages[currentCharacter].id
        return !!isCurrent ? { backgroundColor: '#092e01' } : {}
    };

    useEffect(() => {
        getTrackerHistory();
    }, []);

    const getSortedMessages = () => {
        return [...messages].filter(x => !!x.data.value).map(x => {return {...x, data: {...x.data, value: +x.data.value}}}).sort(
            (a, b) =>
                b.data.value - a.data.value
        );
    };

    const splitTrackerChips = useMemo(() => {
        const sortedMessages = getSortedMessages();
        const displayArrays = [];
        const columnSize = (messages.length / 3);
        while(!!sortedMessages.length) {
            displayArrays.push(sortedMessages.splice(0, columnSize))
        }
        return displayArrays;
    }, [messages])
    
    return (
        <Card sx={{root: {maxWidth: 'fit-content'}, overflowY: 'scroll'}}>
            <CardHeader title='Initiative Tracker' />
           
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                <h2 style={{fontSize: '1.5rem'}}>Turn: {turn}</h2>
                {!!user?.isDm && 
                <Button
                    onClick={() => nextCharacter()}
                    sx={{marginLeft: '2rem'}}
                >
                    Next Character
                </Button>}
                </div>
                <Grid container>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                        {!!messages.length && (
                            <div style={{display: 'flex'}}>
                                {splitTrackerChips.map((display) => {
                                    return(
                                        <List key={uuidv4()}>
                                        {display.filter(x => !!x.data.value && !x.data.delete)
                                            .map((m: TrackerMessage) => {
                                                return (
                                                    <ListItem key={m.name} sx={{justifyContent: 'center'}}>
                                                    <Chip label={`${m.name} ${Number(m.data.value)}`} 
                                                        onClick={() => deleteChip(m)}
                                                        sx={{ 
                                                            '&:hover': { 
                                                                opacity: '.6',
                                                                cursor: 'pointer',
                                                                textDecoration: 'line-through'
                                                            },
                                                            ...getIsCurrentCharacterChip(m)
                                                        }}
                                                    />
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    )
                                })}
                            </div>
                            
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{justifyContent: 'flex-end'}}>
                {user?.isDm && <Button color='error' onClick={() => handleClear()}>
                    Clear Initiative
                </Button>}
                <Button onClick={() => channel.publish(name, {value: score, delete: false})}>
                    Update Initiative
                </Button>
            </CardActions>
        </Card>
    );
};
