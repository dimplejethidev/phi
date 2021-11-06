import { useCallback, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import Chat from './Chat';
import Backdrop from '../Backdrop';

import Utils from '../../utils';
import Ceramic from '../../utils/ceramic';
import Thread from '../../utils/textile/thread';
import { useAppContext } from '../hooks';

const ActiveContact = () => {
  const [contact, setContact] = useState(null);
  const [accepted, setAccepted] = useState(-1);

  const { profile, activeContact, setActiveContact, setContacts } = useAppContext();

  useEffect(() => loadProfile() && loadAck(), [loadProfile, loadAck]);

  useEffect(() => {
    if (accepted === -1) {
      // get the threadId.

      // load the messages from that thread;
    }
  }, [accepted]);

  const loadProfile = useCallback(async () => {
    const ceramic = await Utils.getInstance(Ceramic);
    const _profile = await ceramic.getProfile(activeContact);
    setContact(_profile);
  }, [activeContact]);

  const loadAck = useCallback(async () => {
    const thread = await Utils.getInstance(Thread);

    const received = await thread.ack().get(activeContact);
    if (received) {
      setAccepted(1);
    } else {
      const [from] = await window.ethereum.enable();
      const sent = await thread.ack().get(from, activeContact);
      setAccepted(sent === null ? 0 : 1);
    }
  }, [activeContact]);

  const accept = useCallback(async () => {
    if (window.confirm('Are you sure you want to accept?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.ack().post(true, activeContact);
      setAccepted(1);
    }
  }, [activeContact]);

  const reject = useCallback(async () => {
    if (window.confirm('Are you sure you want to reject?')) {
      const thread = await Utils.getInstance(Thread);
      await thread.ack().post(false, activeContact);

      // Delete this contact from setContacts;
      setContacts((_contacts) => _contacts.filter(c !== activeContact));
      setActiveContact(null);
    }
  }, [activeContact, setContacts, setActiveContact]);

  if (accepted === -1) {
    return (
      <Grid item style={{ position: 'relative', height: '100%' }} sx={{ ml: -20, mt: -10 }}>
        <Backdrop open />
      </Grid>
    );
  }

  if (accepted === 0) {
    return (
      <>
        <h2>Hi, {profile.name}!</h2>
        <h4 style={{ marginTop: '-15px' }}>
          <Tooltip arrow placement="bottom" title={activeContact}>
            <Button variant="text" color="info" size="large" sx={{ ml: '-10px' }}>
              <b style={{ fontSize: 21 }}>{contact.name}</b>
            </Button>
          </Tooltip>
          &nbsp;has sent you a chat request.
        </h4>
        <Grid container spacing={3}>
          <Grid item xs="auto">
            <Button variant="contained" color="success" size="large" onClick={accept}>Accept</Button>
          </Grid>
          <Grid item xs="auto">
            <Button variant="outlined" color="error" size="large" onClick={reject}>Ignore</Button>
          </Grid>
        </Grid>
      </>
    )
  }

  if (accepted == 1) {
    return (
      <Grid item style={{ position: 'relative', height: '100%' }} sx={{ mt: -10 }}>
        <Chat />
      </Grid>
    );
  }
}

export default ActiveContact;